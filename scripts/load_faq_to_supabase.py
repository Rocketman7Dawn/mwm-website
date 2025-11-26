import json
import os
import argparse
from typing import List, Dict

import requests
from supabase import create_client, Client

# ---------- OpenAI + Supabase init ----------

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

supabase_url = os.environ["SUPABASE_URL"]
supabase_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase: Client = create_client(supabase_url, supabase_key)

EMBED_MODEL = "text-embedding-3-small"  # 1536-dim
EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings"


# ---------- Helpers ----------

def load_faq_json(path: str) -> List[Dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_chunk_text(item: Dict) -> str:
    """
    Compose the text that will be embedded + stored as 'content'.

    Adjusted for 'Question' / 'Answer' keys from your mwp_faq.json.
    If a future client uses different keys, we can extend this later.
    """
    q = item.get("Question", "").strip()
    a = item.get("Answer", "").strip()
    return f"Q: {q}\nA: {a}"


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Call OpenAI embeddings API via raw HTTP and return list of vectors.
    This avoids the Python SDK's extra dependencies.
    """
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": EMBED_MODEL,
        "input": texts,
    }

    resp = requests.post(EMBEDDINGS_URL, headers=headers, json=payload)
    if resp.status_code != 200:
        print("Embedding API error:", resp.status_code, resp.text)
        resp.raise_for_status()

    data = resp.json()
    # data["data"] is a list of { "embedding": [...] }
    return [item["embedding"] for item in data["data"]]



def insert_rows(
    client_id: str,
    source_id: str,
    contents: List[str],
    faq_items: List[Dict],
    start_chunk_index: int = 0
) -> int:
    """
    Embed and insert all FAQ entries into Supabase.

    Returns total rows inserted.
    """
    batch_size = 50
    chunk_index = start_chunk_index
    total_inserted = 0

    # Build metadata list from faq_items once
    metadata_list = []
    for item in faq_items:
        metadata_list.append({
            "type": "faq",
            "question": item.get("Question"),
            "answer": item.get("Answer"),
            "tags": item.get("tags", [])
        })

    for start in range(0, len(contents), batch_size):
        end = start + batch_size
        batch_contents = contents[start:end]
        batch_metadata = metadata_list[start:end]

        print(f"Embedding items {start} to {end - 1}...")
        embeddings = embed_texts(batch_contents)

        rows = []
        for i, emb in enumerate(embeddings):
            rows.append({
                "client_id": client_id,
                "source_id": source_id,
                "chunk_index": chunk_index,
                "content": batch_contents[i],
                "metadata": batch_metadata[i],
                "embedding": emb
            })
            chunk_index += 1

        print(f"Inserting {len(rows)} rows into Supabase...")
        resp = supabase.table("client_knowledge_chunks").insert(rows).execute()

        # supabase-py usually returns resp.data / resp.error, but let's be defensive
        if hasattr(resp, "error") and resp.error:
            print("Error inserting rows:", resp.error)
            raise RuntimeError(resp.error)
        elif isinstance(resp, dict) and resp.get("error"):
            print("Error inserting rows:", resp["error"])
            raise RuntimeError(resp["error"])

        total_inserted += len(rows)
        print(f"Total inserted so far: {total_inserted}")

    return total_inserted


# ---------- Main ----------

def main():
    parser = argparse.ArgumentParser(
        description="Load a FAQ JSON file into Supabase client_knowledge_chunks with embeddings."
    )

    parser.add_argument(
        "--client-id",
        required=True,
        help="Client ID (e.g. 'mwp', 'soulcoach')."
    )

    parser.add_argument(
        "--source-id",
        required=True,
        help="Source identifier for this FAQ set (e.g. 'mwp_faq_v1')."
    )

    parser.add_argument(
        "--json-path",
        required=True,
        help="Path to the FAQ JSON file (e.g. 'data/mwp_faq.json')."
    )

    parser.add_argument(
        "--start-chunk-index",
        type=int,
        default=0,
        help="Starting chunk index (default: 0). Use a higher number if appending new chunks."
    )

    args = parser.parse_args()

    client_id = args.client_id
    source_id = args.source_id
    json_path = args.json_path
    start_chunk_index = args.start_chunk_index

    print(f"Loading FAQ from {json_path} ...")
    faq_items = load_faq_json(json_path)
    print(f"Loaded {len(faq_items)} FAQ items.")

    contents = [build_chunk_text(item) for item in faq_items]

    print(f"Embedding and inserting for client_id='{client_id}', source_id='{source_id}' ...")
    total = insert_rows(
        client_id=client_id,
        source_id=source_id,
        contents=contents,
        faq_items=faq_items,
        start_chunk_index=start_chunk_index
    )

    print(f"Done! Inserted {total} rows into client_knowledge_chunks. 🎉")


if __name__ == "__main__":
    main()
