import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RealtimeMessage {
  type: string;
  [key: string]: any;
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAISocket: WebSocket | null = null;

  console.log('WebSocket connection established');

  socket.onopen = () => {
    console.log('Client connected to Supabase edge function');
    
    // Connect to OpenAI Realtime API
    openAISocket = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    openAISocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API');
    };

    openAISocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received from OpenAI:', data.type);

      // Handle session.created event - send session update
      if (data.type === 'session.created') {
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `You are a helpful AI financial advisor assistant. You help users understand their investment portfolio and risk assessment. 

Key guidelines:
- Be conversational, friendly, and encouraging
- Explain financial concepts in simple terms
- Focus on the user's specific risk profile and portfolio allocation
- Provide actionable insights and suggestions
- If asked about specific investments, always recommend consulting with a financial professional for personalized advice
- Keep responses concise but informative

You can help users understand:
- Their risk assessment results and what they mean
- Portfolio allocation recommendations
- Investment concepts and strategies
- Market trends and how they might affect their investments

Always maintain a supportive and educational tone.`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            tools: [
              {
                type: 'function',
                name: 'get_user_portfolio_info',
                description: 'Get information about the user\'s current portfolio allocation and performance',
                parameters: {
                  type: 'object',
                  properties: {
                    info_type: {
                      type: 'string',
                      enum: ['allocation', 'performance', 'risk_assessment', 'recommendations']
                    }
                  },
                  required: ['info_type']
                }
              },
              {
                type: 'function',
                name: 'explain_financial_concept',
                description: 'Provide detailed explanation of financial concepts',
                parameters: {
                  type: 'object',
                  properties: {
                    concept: {
                      type: 'string',
                      description: 'The financial concept to explain'
                    }
                  },
                  required: ['concept']
                }
              }
            ],
            tool_choice: 'auto',
            temperature: 0.8,
            max_response_output_tokens: 'inf'
          }
        };
        
        console.log('Sending session update to OpenAI');
        openAISocket?.send(JSON.stringify(sessionUpdate));
      }

      // Handle function calls
      if (data.type === 'response.function_call_arguments.done') {
        console.log('Function call received:', data.name, data.arguments);
        
        let result = '';
        const args = JSON.parse(data.arguments);
        
        if (data.name === 'get_user_portfolio_info') {
          switch (args.info_type) {
            case 'allocation':
              result = 'Based on your portfolio, I can see you have a moderate risk allocation with 35% large-cap stocks, 30% bonds, 20% ETFs, 10% dividend stocks, and 5% cash. This is well-diversified for your risk profile.';
              break;
            case 'performance':
              result = 'Your portfolio is currently showing positive performance with an expected annual return of 8% and moderate volatility of 12%. This aligns well with your moderate risk tolerance.';
              break;
            case 'risk_assessment':
              result = 'Your risk assessment shows you have a moderate risk tolerance, which means you\'re comfortable with some volatility in exchange for potentially better returns than conservative investments.';
              break;
            case 'recommendations':
              result = 'Based on your risk profile, I recommend maintaining your current balanced allocation but consider rebalancing quarterly to maintain your target percentages.';
              break;
          }
        } else if (data.name === 'explain_financial_concept') {
          result = `Let me explain ${args.concept}: This is a fundamental concept in investing that helps you understand how to build and manage your portfolio effectively.`;
        }

        // Send function call result back to OpenAI
        const functionResult = {
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: data.call_id,
            output: result
          }
        };
        
        openAISocket?.send(JSON.stringify(functionResult));
        openAISocket?.send(JSON.stringify({ type: 'response.create' }));
      }

      // Forward all messages to client
      socket.send(event.data);
    };

    openAISocket.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      socket.send(JSON.stringify({ type: 'error', message: 'OpenAI connection error' }));
    };

    openAISocket.onclose = () => {
      console.log('OpenAI WebSocket closed');
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    // Forward client messages to OpenAI
    if (openAISocket?.readyState === WebSocket.OPEN) {
      console.log('Forwarding message to OpenAI:', JSON.parse(event.data).type);
      openAISocket.send(event.data);
    }
  };

  socket.onclose = () => {
    console.log('Client disconnected');
    openAISocket?.close();
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
    openAISocket?.close();
  };

  return response;
});