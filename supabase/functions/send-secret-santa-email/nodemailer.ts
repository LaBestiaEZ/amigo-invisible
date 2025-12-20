import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import nodemailer from 'npm:nodemailer@6.9.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { giverName, giverEmail, receiverName, roomName, receiverPreferences } = await req.json()

    // Verificar que tenemos todos los datos
    if (!giverName || !giverEmail || !receiverName || !roomName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Faltan datos requeridos',
          received: { giverName, giverEmail, receiverName, roomName }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verificar que tenemos las credenciales de Gmail
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD')
    
    if (!gmailUser || !gmailPass) {
      return new Response(
        JSON.stringify({ success: false, error: 'GMAIL_USER o GMAIL_APP_PASSWORD no configuradas en Supabase' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Configurar transporter de nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    })

    // HTML del email
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Tu Amigo Invisible</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, Cantarell, sans-serif;
      line-height: 1.6;
      background-color: transparent;
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .card {
      background: #f9fafb;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(to right, #9333ea, #7e22ce);
      padding: 40px 30px;
      text-align: center;
      color: white;
      
    }
    
    .header-icon {
      font-size: 80px;
      margin-bottom: 5px;
      
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #ffffff !important;
    }
    
    .header p {
      font-size: 18px;
      opacity: 0.95;
      color: #ffffff !important;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .gift-box {
      background: linear-gradient(to right, #9333ea, #7e22ce);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 20px 0;
      color:white
    }
    
    .gift-icon {
      font-size: 60px;
      margin-bottom: 15px;
    }
    
    .receiver-name {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff !important;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 10px;
    }
    
    .preferences-box {
      background: #f3e8ff;
      border: 2px solid #e9d5ff;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .preferences-box h3 {
      color: #7e22ce;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .preferences-box p {
      color: #6b21a8;
      font-size: 14px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    
    .room-info {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 20px;
    }
    
    .room-info strong {
      color: #374151;
      font-weight: 600;
    }
    
    
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer p {
      margin: 8px 0;
    }
    
    .footer-icon {
      font-size: 24px;
      margin: 10px 5px;
    }
    
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .receiver-name {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="header-icon">👤</div>
        <h1 style="color: #ffffff !important;">¡Hola ${giverName}!</h1>
        <p style="color: #ffffff !important;">Tu amigo invisible es...</p>
      </div>
      
      <div class="content">
        <div class="gift-box">
          <div class="gift-icon">🎁</div>
          <div class="receiver-name" style="color: #ffffff !important;">${receiverName}</div>
        </div>
        
        ${receiverPreferences ? `
        <div class="preferences-box">
          <h3>🎁 Sus gustos y preferencias:</h3>
          <p>${receiverPreferences}</p>
        </div>
        ` : ''}
        
        <div class="room-info">
          <strong>Sala:</strong> ${roomName}
        </div>
        
      </div>
      
      <div class="footer">
        <p>Este email fue generado automáticamente por la aplicación</p>
        <p><strong>Amigo Invisible</strong></p>
        <div class="footer-icon">⭐ ⭐</div>
        <p>¡Felices fiestas!</p>
      </div>
    </div>
  </div>
</body>
</html>`

    // Enviar email con nodemailer
    const info = await transporter.sendMail({
      from: `"Amigo Invisible" <${gmailUser}>`,
      to: giverEmail,
      subject: `🎁 Tu Amigo Invisible - ${roomName}`,
      html: html,
    })

    console.log('Email enviado con éxito a:', giverEmail, 'ID:', info.messageId)
    return new Response(
      JSON.stringify({ 
        success: true,
        emailId: info.messageId,
        message: 'Email enviado correctamente'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error en Edge Function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Error desconocido', details: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
