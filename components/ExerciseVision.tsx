
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Camera, X, Activity, Mic, BrainCircuit, ShieldAlert, Sparkles } from 'lucide-react';

const ExerciseVision: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            // Start frame streaming strictly after connection
            frameIntervalRef.current = window.setInterval(() => {
              if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = 480;
                canvasRef.current.height = 360;
                ctx?.drawImage(videoRef.current, 0, 0, 480, 360);
                
                canvasRef.current.toBlob(async (blob) => {
                  if (blob && sessionPromiseRef.current) {
                    const base64Data = await blobToBase64(blob);
                    sessionPromiseRef.current.then(session => {
                      session.sendRealtimeInput({
                        media: { data: base64Data, mimeType: 'image/jpeg' }
                      });
                    });
                  }
                }, 'image/jpeg', 0.6);
              }
            }, 1500);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current!);
              
              const now = audioContextRef.current.currentTime;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              source.onended = () => sourcesRef.current.delete(source);
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            setError("Vision link failed. Please retry.");
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are an elite real-time physiotherapy coach. Watch the video feed carefully. 1. Identify the exercise being performed. 2. Provide precise voice feedback on form (e.g., "Keep your back straight", "Slow down the descent"). 3. Answer any curiosities or questions the patient asks verbally during the workout. Be highly encouraging and focus on safety.',
        }
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Camera or Audio access denied.");
      setIsConnecting(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };

  const stopSession = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close());
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-5xl bg-black rounded-[48px] overflow-hidden shadow-2xl relative border border-white/10 ring-1 ring-white/20">
        
        {/* Header Overlay */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
          <div className="bg-black/40 backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-4 border border-white/10">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
              {isActive ? 'Real-time AI Coach' : isConnecting ? 'Establishing Neural Link' : 'Vision Standby'}
              {isActive && <Sparkles className="w-3 h-3 text-emerald-400" />}
            </span>
          </div>
          <button onClick={onClose} className="p-4 bg-white/10 hover:bg-rose-600 text-white rounded-2xl transition-all border border-white/10 hover:scale-105 active:scale-95">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Surface */}
        <div className="relative w-full aspect-video bg-slate-900 group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 pointer-events-none border-[24px] border-black/20" />
          
          {/* Action Button */}
          {!isActive && !isConnecting && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/40">
              <div className="w-24 h-24 bg-emerald-600/20 rounded-full flex items-center justify-center border border-emerald-500/30 animate-pulse">
                <BrainCircuit className="w-12 h-12 text-emerald-400" />
              </div>
              <button 
                onClick={startSession}
                className="group bg-emerald-600 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/40 flex items-center gap-4 transform hover:-translate-y-1 active:translate-y-0"
              >
                <Camera className="w-8 h-8 group-hover:rotate-12 transition-transform" /> 
                Enter AI Lab
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-rose-600 text-white p-10 rounded-[40px] flex flex-col items-center gap-6 max-w-md text-center shadow-2xl border border-rose-500/50">
                <ShieldAlert className="w-16 h-16" />
                <h3 className="text-2xl font-black">Connection Interrupted</h3>
                <p className="font-bold text-rose-100 text-sm">{error}</p>
                <button onClick={startSession} className="bg-white text-rose-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 transition">Retry Sync</button>
              </div>
            </div>
          )}
        </div>

        {/* AI Voice Indicator */}
        {isActive && (
          <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-8">
            <div className="flex items-center gap-8">
              <div className="flex gap-1.5 h-12 items-center">
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} className="w-1.5 bg-emerald-500 rounded-full animate-wave" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                  AI Coach Monitoring <Activity className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Voice Feedback Enabled • Ask me "Why?"</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="p-5 bg-white/5 rounded-3xl text-white border border-white/10">
                <Mic className="w-6 h-6 text-emerald-400" />
              </div>
              <button 
                onClick={stopSession} 
                className="flex-grow md:flex-none px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.2); }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ExerciseVision;
