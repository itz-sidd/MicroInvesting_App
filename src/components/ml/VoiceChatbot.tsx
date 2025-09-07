import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, MessageCircle, User, Bot, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceChatbotProps {
  userContext?: {
    riskCategory?: string;
    riskScore?: number;
    portfolio?: any;
  };
}

export function VoiceChatbot({ userContext }: VoiceChatbotProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Connect to WebSocket
      const wsUrl = `wss://ehenxlhyofsyqcnsxjhq.functions.supabase.co/realtime-chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to voice chatbot');
        setIsConnected(true);
        toast.success('Connected to AI advisor');
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Hello! I\'m your AI financial advisor. I can help you understand your risk assessment, portfolio allocation, and answer any investment questions you have. Feel free to speak naturally with me!',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type, data);

        if (data.type === 'response.audio.delta' && isAudioEnabled) {
          // Play audio response
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          if (audioContextRef.current) {
            await playAudioData(audioContextRef.current, bytes);
          }
          setIsSpeaking(true);
        } else if (data.type === 'response.audio.done') {
          setIsSpeaking(false);
        } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
          // User's speech transcription
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: data.transcript,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          setCurrentTranscript('');
        } else if (data.type === 'response.audio_transcript.delta') {
          // AI's response transcript (build it up)
          setCurrentTranscript(prev => prev + data.delta);
        } else if (data.type === 'response.audio_transcript.done') {
          // Final AI transcript
          if (currentTranscript) {
            const aiMessage: ChatMessage = {
              id: Date.now().toString(),
              type: 'assistant',
              content: currentTranscript,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setCurrentTranscript('');
          }
        } else if (data.type === 'input_audio_buffer.speech_started') {
          console.log('User started speaking');
          setIsRecording(true);
        } else if (data.type === 'input_audio_buffer.speech_stopped') {
          console.log('User stopped speaking');
          setIsRecording(false);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsRecording(false);
        setIsSpeaking(false);
      };

      // Start audio recording
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await audioRecorderRef.current.start();
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation: ' + (error as Error).message);
    }
  };

  const endConversation = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setCurrentTranscript('');
    
    toast.info('Conversation ended');
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast.info(isAudioEnabled ? 'Audio responses disabled' : 'Audio responses enabled');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full max-w-4xl mx-auto border-2">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Financial Advisor
            </CardTitle>
            <CardDescription>
              Speak naturally to get insights about your portfolio and risk assessment
            </CardDescription>
          </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                disabled={!isConnected}
                className="relative z-10"
              >
                {isAudioEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              
              {!isConnected ? (
                <Button onClick={startConversation} className="relative z-10">
                  Start Conversation
                </Button>
              ) : (
                <Button variant="destructive" onClick={endConversation} className="relative z-10">
                  End Conversation
                </Button>
              )}
          </div>
        </div>
          
          {isConnected && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
            <Badge variant={isRecording ? "default" : "secondary"}>
              <Mic className="h-3 w-3 mr-1" />
              {isRecording ? 'Listening...' : 'Ready'}
            </Badge>
            
            {isSpeaking && (
              <Badge variant="outline">
                <Bot className="h-3 w-3 mr-1" />
                AI Speaking
              </Badge>
            )}
            
            {!isAudioEnabled && (
              <Badge variant="outline">
                <VolumeX className="h-3 w-3 mr-1" />
                Audio Off
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
        
        <CardContent className="p-6">
          {userContext && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Current Profile:
              </h4>
              <div className="text-sm space-y-2">
                {userContext.riskCategory && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Risk Profile:</span>
                    <Badge variant="secondary" className="capitalize">{userContext.riskCategory}</Badge>
                  </div>
                )}
                {userContext.riskScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Risk Score:</span>
                    <span className="font-medium">{Math.round(userContext.riskScore * 100)}/100</span>
                  </div>
                )}
            </div>
          </div>
        )}

          <div className="border rounded-lg bg-background relative">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 max-w-full ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                    
                    <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-[85%] break-words ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                  </div>
                </div>
              </div>
            ))}
            
                {currentTranscript && (
                  <div className="flex items-start gap-3 max-w-full">
                    <div className="p-2 rounded-full bg-muted flex-shrink-0">
                  <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block p-3 rounded-lg max-w-[85%] bg-muted break-words">
                        <p className="text-sm whitespace-pre-wrap">{currentTranscript}</p>
                        <div className="flex items-center gap-1 mt-2">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {!isConnected && messages.length === 0 && (
            <div className="border rounded-lg bg-background">
              <div className="text-center py-12 px-6 text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-2">Ready to Chat with Your AI Advisor</h3>
                <p className="mb-1">Click "Start Conversation" to begin talking with your AI financial advisor</p>
                <p className="text-sm">Make sure to allow microphone access when prompted</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}