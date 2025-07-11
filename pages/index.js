import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mindfulness with Mind</title>
        <meta name="description" content="Mindfulness with Mind - AI for the conscious human" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Mindfulness with Mind</h1>
        <p className={styles.description}>
          Supporting mindful businesses with holistic AI.
        </p>
      </main>
    </div>
  )
}
