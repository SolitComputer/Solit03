import React from 'react';
import { Check } from 'lucide-react';

function ProgressBar({ currentStep, totalSteps = 3 }) {
    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'active';
        return '';
    };

    const getStepIcon = (step, status) => {
        if (status === 'completed') return <Check className="w-4 h-4" aria-hidden="true" />;
        return step;
    };

    const getStepLabel = (step) => {
        switch (step) {
            case 1: return 'Pilih Kategori';
            case 2: return 'Filter Pilihan';
            case 3: return 'Lihat Hasil';
            default: return '';
        }
    };

    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="progress-container w-full bg-blue-100 rounded-xl my-2.5 mb-5 overflow-hidden">
            <div
                className="progress-bar h-1.5 bg-blue-600 rounded-xl transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
            />
            <div className="progress-steps flex justify-between mt-3">
                {[1, 2, 3].map(step => {
                    const status = getStepStatus(step);
                    return (
                        <div key={step} className={`progress-step flex flex-col items-center gap-1.5 text-xs ${status === 'active' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                            <div className={`step-circle w-[30px] h-[30px] rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-sm font-bold ${status === 'active' ? 'bg-blue-600 text-white border-transparent' : status === 'completed' ? 'bg-blue-600 text-white border-transparent' : ''}`}>
                                {getStepIcon(step, status)}
                            </div>
                            <span>{getStepLabel(step)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProgressBar;