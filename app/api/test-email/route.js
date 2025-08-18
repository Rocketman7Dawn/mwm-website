import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)

export async function POST(req) {
  try {
    const body = await req.json()
    const { to, subject, text } = body

    if (!to || !subject || !text) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), { status: 400 })
    }

    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY
    })

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to,
      subject,
      text,
    })

    return new Response(JSON.stringify({ success: true, response }), { status: 200 })
  } catch (err) {
    console.error('Mailgun Error:', err)
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal error',
      details: err.message
    }), { status: 500 })
  }
}

// ✅ Optional GET handler for testing in browser
export async function GET() {
  return new Response(JSON.stringify({
    success: false,
    message: 'This route only supports POST requests. Use a tool like curl or Postman to send email.'
  }), { status: 405 })
}
