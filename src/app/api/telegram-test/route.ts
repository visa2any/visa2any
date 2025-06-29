import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {  try {    const token = process.env.TELEGRAM_BOT_TOKEN,    
    if (!token) {      return NextResponse.json({ error: 'Token não configurado' }, { status: 400 })
    }

    // Buscar updates do Telegram

    const response =  
const data = await response.json()

    // Extrair chat IDs únicos

    const chatIds =  
const messages = [],
    if (data.result && data.result.length > 0) {      data.result.forEach((update: any) => {        if (update.message) {          const chatId =  
const firstName = update.message.chat.first_name || 'Sem nome'
          const username =  
const text = update.message.text || 'Sem texto',          
          chatIds.add(chatId),          messages.push({            chatId,            firstName,            username,            text,            date: new Date(update.message.date * 1000).toLocaleString()
          })
        }
      })
    },
    return NextResponse.json({      success: true,      token: `${token.substring(0, 10)}...`,      totalUpdates: data.result?.length || 0,      uniqueChatIds: Array.from(chatIds),      messages: messages.slice(-5), // Últimas 5 mensagens,      rawData: data
    })

  } catch (error) {    return NextResponse.json({ ,      error: 'Erro ao buscar dados do Telegram',      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
},

export async function POST(request: NextRequest) {  try {    const { chatId, message } = await request.json(),    const token = process.env.TELEGRAM_BOT_TOKEN,    
    if (!token) {      return NextResponse.json({ error: 'Token não configurado' }, { status: 400 })
    }

    // Enviar mensagem de teste

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {      method: 'POST',      headers: {        'Content-Type': 'application/json'
      },      body: JSON.stringify({        chat_id: chatId,        text: message || '🤖 Teste do Visa2Any!\n\nSeu bot está funcionando perfeitamente! ✅'
      })
    }),
    const data = await response.json(),
    return NextResponse.json({      success: data.ok,      data,      sentTo: chatId,      message: message || 'Mensagem de teste'
    })

  } catch (error) {    return NextResponse.json({ ,      error: 'Erro ao enviar mensagem',      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}