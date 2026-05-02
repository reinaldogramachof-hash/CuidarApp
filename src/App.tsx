/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ScreenId = 'splash' | 'dashboard' | 'medicacao' | 'agenda' | 'relatorios' | 'perfil' | 'alertas';

// --- Components ---

const PhoneFrame = ({ children, currentScreen }: { children: React.ReactNode, currentScreen: ScreenId }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="relative w-[390px] h-[844px] bg-white rounded-[40px] overflow-hidden phone-shadow flex flex-col border-[8px] border-neutral-900">
        {/* Status Bar */}
        <div className="h-11 px-8 flex items-center justify-between z-50 bg-white/80 backdrop-blur-md">
          <div className="text-[14px] font-semibold">09:41</div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-signal text-[12px]"></i>
            <i className="fas fa-wifi text-[12px]"></i>
            <i className="fas fa-battery-full text-[14px]"></i>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-hidden relative bg-neutral-50">
          {children}
        </div>

        {/* Bottom Nav */}
        {currentScreen !== 'splash' && (
          <div className="h-[72px] bg-white border-t border-neutral-200 flex items-center justify-around px-4 pb-4 z-50 bottom-nav-shadow">
            <NavItem id="dashboard" icon="fa-house" label="Início" active={currentScreen === 'dashboard' || currentScreen === 'perfil'} />
            <NavItem id="medicacao" icon="fa-capsules" label="Saúde" active={currentScreen === 'medicacao'} />
            <NavItem id="agenda" icon="fa-calendar-days" label="Agenda" active={currentScreen === 'agenda'} />
            <NavItem id="relatorios" icon="fa-chart-line" label="Relatórios" active={currentScreen === 'relatorios'} />
            <NavItem id="alertas" icon="fa-gear" label="Ajustes" active={currentScreen === 'alertas'} />
          </div>
        )}

        {/* Home Indicator */}
        {currentScreen !== 'splash' && (
           <div className="absolute bottom-1 w-full flex justify-center h-1 pointer-events-none">
             <div className="w-32 h-1 bg-neutral-900 rounded-full opacity-20"></div>
           </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ id, icon, label, active }: { id: string, icon: string, label: string, active: boolean }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-1 cursor-pointer relative transition-colors ${active ? 'text-primary' : 'text-neutral-600'}`}
      onClick={() => window.dispatchEvent(new CustomEvent('nav-change', { detail: id }))}
    >
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -top-[14px] w-12 h-[3px] bg-primary rounded-full" 
        />
      )}
      <motion.i 
        whileTap={{ scale: 1.15 }}
        className={`fas ${icon} text-[20px]`}
      />
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
};

const Header = ({ title, showBack, onBack, rightAction }: { title: string, showBack?: boolean, onBack?: () => void, rightAction?: React.ReactNode }) => {
  return (
    <div className="h-16 px-5 flex items-center justify-between bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="w-10">
        {showBack && (
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full active:scale-95 transition-transform">
            <i className="fas fa-arrow-left text-neutral-900"></i>
          </button>
        )}
      </div>
      <h1 className="font-display font-bold text-[18px] text-neutral-900 line-clamp-1">{title}</h1>
      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </div>
  );
};

// --- Screens ---

const SplashScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="h-full w-full bg-[linear-gradient(145deg,#EBF4FB_0%,#F7F9FC_60%,#E8F8F1_100%)] flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-primary rounded-[28px] flex items-center justify-center shadow-lg mb-6"
      >
        <i className="fas fa-heart-pulse text-white text-[48px]"></i>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display font-extrabold text-[32px] text-primary mb-2"
      >
        CuidarApp
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-600 font-medium mb-12 max-w-[240px]"
      >
        Cuidado com quem importa, visibilidade para você.
      </motion.p>

      {/* Simplified SVG Illustration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full h-48 mb-12 opacity-60"
      >
        <svg viewBox="0 0 200 150" className="w-full h-full">
           <circle cx="100" cy="70" r="40" fill="#1B6CA833" />
           <path d="M60 140 Q100 100 140 140" stroke="#1B6CA8" strokeWidth="2" fill="none" opacity="0.3" />
           <rect x="85" y="110" width="30" height="40" rx="15" fill="#1B6CA8" opacity="0.2" />
        </svg>
      </motion.div>

      <div className="w-full flex flex-col gap-4">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-md hover:brightness-110 active:brightness-90 transition-all"
        >
          Entrar
        </motion.button>
        <button className="text-neutral-600 font-semibold text-sm">
          Criar conta gratuita
        </button>
      </div>
    </div>
  );
};

const DashboardScreen = ({ onProfileClick, onAlertsClick }: { onProfileClick: () => void, onAlertsClick: () => void }) => {
  return (
    <div className="h-full overflow-y-auto pb-10">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/10">
            MS
          </div>
          <div>
            <h2 className="font-display font-bold text-[18px]">Olá, Mariana 👋</h2>
            <p className="text-[12px] text-neutral-600">Sábado, 02 de maio</p>
          </div>
        </div>
        <button 
          onClick={onAlertsClick}
          className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center relative active:scale-90 transition-transform"
        >
          <i className="fa-regular fa-bell text-neutral-600"></i>
          <span className="absolute top-2 right-2 w-4 h-4 bg-danger text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* Familiar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onProfileClick}
          className="bg-white p-5 rounded-[24px] card-shadow border border-neutral-200 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?u=maria" 
                alt="Maria" 
                className="w-16 h-16 rounded-full border-4 border-secondary p-0.5 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-display font-bold text-[18px]">Maria da Silva</h3>
              <p className="text-neutral-600 text-sm">78 anos • Mãe</p>
              <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 bg-secondary/10 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-secondary text-[10px] font-bold uppercase tracking-wide">Cuidador Presente</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.pravatar.cc/150?u=ana" 
                alt="Ana" 
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-[10px] text-neutral-600 font-bold uppercase leading-tight">Responsável Hoje</p>
                <p className="text-sm font-bold">Ana Lima</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-neutral-400 text-xs"></i>
          </div>
        </motion.div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard icon="fa-capsules" color="text-primary" bg="bg-primary-light" label="Medicação" value="3 de 4" subValue="Concluídas" />
          <SummaryCard icon="fa-list-check" color="text-secondary" bg="bg-secondary/10" label="Tarefas" value="5 de 7" subValue="Realizadas" />
          <SummaryCard icon="fa-triangle-exclamation" color="text-warning" bg="bg-warning/10" label="Alertas" value="1" subValue="Pendente" extraPulse />
          <SummaryCard icon="fa-calendar-day" color="text-neutral-900" bg="bg-neutral-100" label="Próxima" value="07:00" subValue="Amanhã" />
        </div>

        {/* Timeline */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Linha do Tempo</h3>
            <button className="text-primary font-bold text-xs">Ver tudo</button>
          </div>
          
          <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
            <TimelineItem hour="07:30" title="Check-in da cuidadora" desc="Ana Lima iniciou o serviço" status="done" delay={0.1} />
            <TimelineItem hour="08:00" title="Café da manhã" desc="Ingestão de frutas e cereais" status="done" delay={0.2} />
            <TimelineItem hour="08:30" title="Medicação: Losartana" desc="Confirmado por Ana Lima" status="done" delay={0.3} />
            <TimelineItem hour="12:00" title="Almoço" desc="Refeição completa realizada" status="active" delay={0.4} />
            <TimelineItem hour="14:00" title="Medicação: Metformina" desc="Aguardando confirmação" status="pending" delay={0.5} />
            <TimelineItem hour="19:30" title="Check-out previsto" desc="Finalização do turno" status="pending" delay={0.6} />
          </div>
        </div>

        {/* Last Photos */}
        <div className="pt-2">
           <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900">Últimas Fotos</h3>
              <p className="text-[12px] text-neutral-600">Enviadas pela Ana hoje</p>
            </div>
            <button className="text-primary font-bold text-xs">+ Ver todas</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
            {[1, 2, 3].map(id => (
              <img 
                key={id}
                src={`https://picsum.photos/seed/${id + 10}/200`} 
                alt="Update" 
                className="w-24 h-24 rounded-2xl object-cover border border-neutral-200 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, color, bg, label, value, subValue, extraPulse }: any) => (
  <div className="bg-white p-4 rounded-[20px] border border-neutral-200 flex flex-col items-center text-center">
    <div className={`w-10 h-10 ${bg} ${color} rounded-full flex items-center justify-center mb-2 ${extraPulse ? 'animate-pulse' : ''}`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-1">{label}</span>
    <p className="font-display font-extrabold text-[20px] leading-tight">{value}</p>
    <p className="text-[11px] text-neutral-500 font-medium">{subValue}</p>
  </div>
);

const TimelineItem = ({ hour, title, desc, status, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex gap-4 pb-6 group"
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white border-2 ${status === 'done' ? 'border-secondary text-secondary' : status === 'active' ? 'border-primary text-primary' : 'border-neutral-300 text-neutral-400'}`}>
      <i className={`fas ${status === 'done' ? 'fa-check text-[10px]' : 'fa-circle text-[6px]'}`}></i>
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-extrabold text-neutral-900">{hour}</span>
        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
        <h4 className={`text-[14px] font-bold ${status === 'active' ? 'text-primary' : 'text-neutral-900'}`}>{title}</h4>
      </div>
      <p className="text-[12px] text-neutral-500">{desc}</p>
    </div>
  </motion.div>
);

const MedicationScreen = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Header title="Medicação e Saúde" />
      <div className="p-5 space-y-6">
        {/* Progress Card */}
        <div className="bg-white p-6 rounded-[28px] card-shadow border border-neutral-200 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-100" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={91} className="text-primary transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-[32px] text-neutral-900 leading-none">3/4</span>
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">75%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-neutral-900">Doses administradas hoje</p>
            <p className="text-sm text-primary font-bold mt-1">
              <i className="fa-regular fa-clock mr-1"></i> Próxima: 14:00 (Pendente)
            </p>
          </div>
        </div>

        {/* Medication List */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Agenda de Hoje</h3>
          <div className="space-y-3">
            <MedCard name="Losartana 50mg" time="08:00" status="done" caregiver="Ana Lima" confirmTime="08:12" />
            <MedCard name="Atorvastatina 20mg" time="08:00" status="done" caregiver="Ana Lima" confirmTime="08:15" />
            <MedCard name="Complexo B" time="08:00" status="done" caregiver="Ana Lima" confirmTime="08:16" />
            <MedCard name="Metformina 500mg" time="14:00" status="pending" />
          </div>
        </div>

        {/* Vital Signs */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Sinais Vitais</h3>
          <div className="grid grid-cols-3 gap-3">
             <VitalCard label="Pressão" value="12/8" unit="mmHg" status="ok" />
             <VitalCard label="Glicemia" value="98" unit="mg/dL" status="ok" />
             <VitalCard label="SpO2" value="97%" unit="Saturação" status="ok" />
          </div>
          <div className="mt-4 p-4 bg-white rounded-2xl border border-neutral-200">
             <div className="flex items-center justify-between mb-3 text-[12px]">
                <span className="text-neutral-500">Última aferição: hoje às 09:45</span>
                <span className="text-neutral-500">por Ana Lima</span>
             </div>
             <button className="w-full py-2.5 text-primary bg-primary-light rounded-xl font-bold text-sm active:scale-[0.98] transition-transform">
                Ver histórico completo
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedCard = ({ name, time, status, caregiver, confirmTime }: any) => (
  <div className={`p-4 rounded-2xl border ${status === 'done' ? 'bg-white border-neutral-200' : 'bg-primary-light border-primary/20'}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
         <span className="font-display font-extrabold text-[16px] text-neutral-900">{time}</span>
         <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${status === 'done' ? 'bg-secondary/10 text-secondary' : 'bg-primary text-white'}`}>
            {status === 'done' ? 'Administrada' : 'Pendente'}
         </span>
      </div>
      {status === 'done' && <i className="fas fa-check-circle text-secondary"></i>}
    </div>
    <p className="font-bold text-neutral-900 mb-1">{name}</p>
    {caregiver && (
      <p className="text-[11px] text-neutral-500">
        Confirmado por {caregiver} às {confirmTime}
      </p>
    )}
  </div>
);

const VitalCard = ({ label, value, unit, status }: any) => (
  <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
    <p className="text-[10px] text-neutral-600 font-bold uppercase mb-1">{label}</p>
    <p className="font-display font-extrabold text-xl text-neutral-900">{value}</p>
    <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-tighter">{unit}</p>
  </div>
);

const AgendaScreen = () => {
  const days = [
    { d: 'S', n: 27, has: false },
    { d: 'T', n: 28, has: true },
    { d: 'Q', n: 29, has: true },
    { d: 'Q', n: 30, has: true },
    { d: 'S', n: 1, has: true },
    { d: 'S', n: 2, has: true, selected: true },
    { d: 'D', n: 3, has: false },
  ];

  return (
    <div className="h-full overflow-y-auto pb-24">
      <Header title="Agenda de Cuidado" />
      <div className="p-5">
        {/* Calendar Strip */}
        <div className="flex justify-between mb-6">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[12px] font-bold text-neutral-400 uppercase">{day.d}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${day.selected ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-neutral-900 border-neutral-200'}`}>
                {day.n}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${day.has ? 'bg-secondary' : 'bg-transparent'}`}></div>
            </div>
          ))}
        </div>

        {/* Selected Day Agenda */}
        <div className="space-y-4">
          <div className="bg-white rounded-[24px] border border-neutral-200 overflow-hidden card-shadow">
            <div className="bg-secondary p-3 flex items-center justify-center gap-2 text-white font-bold text-xs">
              <i className="fas fa-circle-check"></i> VISITA CONFIRMADA
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=ana" alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Ana Lima</h4>
                    <p className="text-xs text-neutral-500">Cuidado Diurno</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Horário</p>
                  <p className="text-sm font-extrabold text-primary">07:00 - 19:00</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {['Higiene', 'Medicação', 'Alimentação', 'Companhia'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-bold">{tag}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
                  Ver plano completo
                </button>
                <button className="py-3 bg-white text-primary border border-primary rounded-xl font-bold text-sm active:scale-95 transition-transform">
                  Falar com cuidadora
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg">Próximas Visitas</h3>
            <NextVisit date="Segunda, 04 Jan" time="07:00" name="Ana Lima" status="confirmed" />
            <NextVisit date="Terça, 05 Jan" time="07:00" name="Carla Souza" status="pending" />
            <NextVisit date="Quarta, 06 Jan" time="07:00" name="Ana Lima" status="confirmed" />
          </div>
        </div>
      </div>

      {/* FAB */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-2xl elevation-high flex items-center justify-center text-xl z-50"
      >
        <i className="fas fa-plus"></i>
      </motion.button>
    </div>
  );
};

const NextVisit = ({ date, time, name, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex flex-col items-center justify-center">
         <span className="text-[10px] font-bold text-neutral-400">JAN</span>
         <span className="text-sm font-extrabold text-neutral-900 leading-none">0{date.split(' ')[1]}</span>
      </div>
      <div>
        <h4 className="font-bold text-neutral-900 text-sm">{date}</h4>
        <p className="text-[11px] text-neutral-600">{name} • {time}</p>
      </div>
    </div>
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${status === 'confirmed' ? 'bg-secondary/10 text-secondary' : 'bg-warning/10 text-warning'}`}>
      {status === 'confirmed' ? 'Confirmada' : 'Aguardando'}
    </span>
  </div>
);

const ReportsScreen = () => {
  return (
    <div className="h-full overflow-y-auto pb-10">
      <Header title="Relatórios e Insights" />
      <div className="p-5 space-y-6">
        {/* Period Filter */}
        <div className="flex p-1 bg-neutral-200 rounded-xl">
           {['Hoje', 'Semana', 'Mês'].map(f => (
             <button key={f} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${f === 'Mês' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500'}`}>
               {f}
             </button>
           ))}
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-2 gap-3">
          <ReportStat label="Total Visitas" value="22" icon="fa-house-medical" color="text-primary" />
          <ReportStat label="Presença" value="96%" icon="fa-user-check" color="text-secondary" />
          <ReportStat label="Medicações" value="98%" icon="fa-capsules" color="text-secondary" />
          <ReportStat label="Ocorrências" value="2" icon="fa-circle-info" color="text-warning" />
        </div>

        {/* Patient Evolution */}
        <div className="bg-white p-5 rounded-[24px] border border-neutral-200 card-shadow">
          <h3 className="font-display font-bold text-lg mb-3">Evolução do Paciente</h3>
          <p className="text-sm text-neutral-600 italic leading-relaxed mb-4">
            "Maria apresentou boa disposição esta semana. Apetite normalizado após ajuste da medicação. Realizou caminhada leve na terça-feira com auxílio..."
          </p>
          <div className="flex items-center gap-2 border-t border-neutral-100 pt-3">
            <img src="https://i.pravatar.cc/150?u=ana" alt="" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
            <span className="text-[11px] font-bold text-neutral-900">Ana Lima, Cuidadora</span>
            <span className="text-[11px] text-neutral-400 ml-auto">02/05/2026</span>
          </div>
        </div>

        {/* Occurrences */}
        <div className="space-y-3">
           <h3 className="font-display font-bold text-lg">Ocorrências no Período</h3>
           <OccurrenceItem color="warning" date="28/04" title="Queda leve" desc="Queda ao se levantar, sem ferimentos. Médico notificado." />
           <OccurrenceItem color="neutral" date="25/04" title="Recusa alimentar" desc="Recusa no jantar. Ingeriu líquidos normalmente." />
        </div>

        <button className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform">
          <i className="fas fa-download"></i>
          Baixar Relatório Mensal PDF
        </button>
      </div>
    </div>
  );
};

const ReportStat = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-neutral-200 card-shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold text-neutral-500 uppercase">{label}</span>
      <i className={`fas ${icon} text-[14px] ${color}`}></i>
    </div>
    <p className="font-display font-extrabold text-[24px] text-neutral-900">{value}</p>
  </div>
);

const OccurrenceItem = ({ color, date, title, desc }: any) => (
  <div className={`flex gap-4 p-4 bg-white rounded-2xl border border-neutral-200 relative overflow-hidden`}>
    <div className={`absolute left-0 top-0 w-1.5 h-full ${color === 'warning' ? 'bg-warning' : 'bg-neutral-400'}`}></div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
         <span className={`text-[10px] font-bold uppercase ${color === 'warning' ? 'text-warning' : 'text-neutral-500'}`}>
           {color === 'warning' ? 'Atenção' : 'Informação'}
         </span>
         <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
         <span className="text-[10px] text-neutral-400 font-bold">{date}</span>
      </div>
      <h4 className="font-bold text-sm text-neutral-900">{title}</h4>
      <p className="text-[11px] text-neutral-500 leading-tight">{desc}</p>
    </div>
  </div>
);

const ProfileScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="h-full overflow-y-auto pb-10">
      <Header title="Ficha do Paciente" showBack onBack={onBack} />
      <div className="p-5 flex flex-col items-center">
        <div className="relative mb-6">
           <img src="https://i.pravatar.cc/400?u=maria" alt="Maria" className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
           <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
             <i className="fas fa-camera text-sm"></i>
           </button>
        </div>
        
        <h2 className="font-display font-extrabold text-[24px]">Maria da Silva</h2>
        <p className="text-neutral-500 text-sm mb-6">78 anos • Nasc. 12/04/1948</p>

        <div className="w-full space-y-6">
          <section>
            <h3 className="font-display font-bold text-lg mb-3">Condições de Saúde</h3>
            <div className="flex flex-wrap gap-2">
              {['Hipertensão', 'Diabetes Tipo 2', 'Mobilidade Reduzida', 'Risco de Queda'].map(c => (
                <span key={c} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold border border-neutral-200">
                  {c}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white p-5 rounded-[24px] border border-neutral-200 card-shadow">
             <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-widest text-neutral-500">Dependência</h3>
             <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">Moderada</span>
                <span className="text-sm font-extrabold text-primary">65%</span>
             </div>
             <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-primary rounded-full"></div>
             </div>
          </section>

          <section>
             <h3 className="font-display font-bold text-lg mb-3">Contatos de Emergência</h3>
             <div className="space-y-3">
               <EmergencyContact name="Mariana Silva" rel="Filha" phone="(11) 98765-4321" />
               <EmergencyContact name="Dr. Roberto Costa" rel="Médico" phone="(11) 5566-7788" />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const EmergencyContact = ({ name, rel, phone }: any) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center">
         <i className="fas fa-user text-sm"></i>
      </div>
      <div>
        <h4 className="font-bold text-neutral-900 text-sm tracking-tight">{name}</h4>
        <p className="text-[11px] text-neutral-500 font-medium">{rel} • {phone}</p>
      </div>
    </div>
    <button className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center active:scale-90 transition-transform">
      <i className="fas fa-phone-alt animate-pulse"></i>
    </button>
  </div>
);

const AlertsScreen = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Header title="Alertas e Notificações" />
      <div className="p-1 bg-neutral-200 mx-5 my-4 rounded-xl flex">
        {['Todos', 'Urgentes', 'Saúde'].map((t, i) => (
          <button key={t} className={`flex-1 py-1.5 rounded-lg text-xs font-bold tracking-tight transition-all ${i === 0 ? 'bg-white text-primary shadow-sm' : 'text-neutral-500'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="px-5 space-y-3 pb-10">
        <NotificationItem 
          type="URGENTE" 
          color="danger" 
          icon="fa-clock" 
          title="Atraso de Medicação" 
          desc="Metformina com 45min de atraso." 
          time="Agora" 
          unread 
        />
        <NotificationItem 
          type="ATENÇÃO" 
          color="warning" 
          icon="fa-person-falling" 
          title="Relato de Queda" 
          desc="Ana Lima reportou queda leve — sem ferimentos." 
          time="Há 2h" 
          unread 
        />
        <NotificationItem 
          type="INFO" 
          color="secondary" 
          icon="fa-user-check" 
          title="Check-in Realizado" 
          desc="Ana Lima confirmou início do turno às 07:32." 
          time="Há 5h" 
        />
        <NotificationItem 
          type="INFO" 
          color="primary" 
          icon="fa-file-lines" 
          title="Relatório Semanal" 
          desc="O relatório consolidado de Abril já está disponível." 
          time="Ontem" 
        />
      </div>
    </div>
  );
};

const NotificationItem = ({ type, color, icon, title, desc, time, unread }: any) => {
  const colorMap: any = {
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    primary: 'bg-primary-light text-primary border-primary/20',
  };

  return (
    <div className={`p-4 rounded-2xl border bg-white flex gap-4 relative ${unread ? 'card-shadow' : 'opacity-80'}`}>
      <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <i className={`fas ${icon} text-lg`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${color === 'danger' || color === 'warning' ? `text-${color}` : 'text-neutral-600'}`}>{type}</span>
          <span className="text-[10px] text-neutral-400">{time}</span>
        </div>
        <h4 className="font-bold text-neutral-900 text-sm truncate">{title}</h4>
        <p className="text-[12px] text-neutral-500 leading-tight">{desc}</p>
      </div>
      {unread && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [history, setHistory] = useState<ScreenId[]>([]);

  useEffect(() => {
    const handleNav = (e: any) => {
      setHistory(prev => [...prev, currentScreen]);
      setCurrentScreen(e.detail);
    };
    window.addEventListener('nav-change', handleNav as EventListener);
    return () => window.removeEventListener('nav-change', handleNav as EventListener);
  }, [currentScreen]);

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentScreen(prev);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen onNext={() => setCurrentScreen('dashboard')} />;
      case 'dashboard': return <DashboardScreen onProfileClick={() => setCurrentScreen('perfil')} onAlertsClick={() => setCurrentScreen('alertas')} />;
      case 'medicacao': return <MedicationScreen />;
      case 'agenda': return <AgendaScreen />;
      case 'relatorios': return <ReportsScreen />;
      case 'perfil': return <ProfileScreen onBack={goBack} />;
      case 'alertas': return <AlertsScreen />;
      default: return null;
    }
  };

  return (
    <PhoneFrame currentScreen={currentScreen}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}
