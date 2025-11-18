import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { BehavioralQuestion } from '../../types';
import { generateBehavioralQuestions } from '../../services/geminiService';

const BehavioralAuth: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'setup' | 'verify' | 'success'>('initial');
  const [personalTopic, setPersonalTopic] = useState('');
  const [questions, setQuestions] = useState<BehavioralQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  
  // In a real app, this would be encrypted and stored on the backend.
  const [storedAnswers, setStoredAnswers] = useState<Record<number, number> | null>(null);

  const handleStartSetup = async () => {
    if (!personalTopic) return;
    setIsLoading(true);
    const generatedQuestions = await generateBehavioralQuestions(personalTopic);
    setQuestions(generatedQuestions);
    setAnswers({});
    setIsLoading(false);
    if (generatedQuestions.length > 0) {
      setStep('setup');
    } else {
      alert("AI could not generate questions. Please try a different topic.");
    }
  };

  const handleAnswerSelect = (qIndex: number, aIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const saveAnswers = () => {
    // TODO: Encrypt and send to backend for storage.
    setStoredAnswers(answers);
    alert("Your behavioral authentication has been set up successfully!");
    setStep('initial');
  };
  
  const startVerification = () => {
    if (!storedAnswers) {
        alert("Please set up your behavioral authentication first.");
        return;
    }
    setAnswers({});
    setVerificationError(false);
    setStep('verify');
  };
  
  const handleVerify = () => {
      // TODO: This check would happen on the backend.
      const isMatch = JSON.stringify(answers) === JSON.stringify(storedAnswers);
      if (isMatch) {
          setStep('success');
      } else {
          setVerificationError(true);
      }
  };

  const renderContent = () => {
    switch (step) {
      case 'initial':
        return (
          <div className="space-y-6">
            <p className="text-on-surface-variant">Set up or test your Behavioral Authentication. This replaces your password with personal questions only you can answer.</p>
            <Input 
                label="Enter a personal topic for questions"
                value={personalTopic}
                onChange={e => setPersonalTopic(e.target.value)}
            />
            <div className="flex gap-4 pt-2">
                <Button onClick={handleStartSetup} isLoading={isLoading} disabled={!personalTopic}>
                    {storedAnswers ? "Reset Setup" : "Start Setup"}
                </Button>
                {storedAnswers && <Button onClick={startVerification} variant="outlined">Verify Identity</Button>}
            </div>
          </div>
        );
      case 'setup':
      case 'verify':
        return (
            <div className="space-y-6">
                {questions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold text-on-surface">{q.question}</p>
                        <div className="mt-2 space-y-2">
                            {q.options.map((opt, aIndex) => (
                                <label key={aIndex} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${answers[qIndex] === aIndex ? 'bg-primary-container border-primary' : 'border-outline'}`}>
                                    <input type="radio" name={`q-${qIndex}`} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" onChange={() => handleAnswerSelect(qIndex, aIndex)}/>
                                    <span className="ml-3 text-sm text-on-surface">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                {verificationError && <p className="text-error font-bold">Answers do not match. Please try again.</p>}
                <Button onClick={step === 'setup' ? saveAnswers : handleVerify} disabled={Object.keys(answers).length !== questions.length}>
                    {step === 'setup' ? 'Save Answers' : 'Verify My Identity'}
                </Button>
            </div>
        );
      case 'success':
        return (
            <div className="text-center space-y-4">
                <p className="text-2xl font-bold text-green-500">Verification Successful!</p>
                <p className="text-on-surface-variant">Access granted. The master password has been revealed/auto-filled.</p>
                <Button onClick={() => setStep('initial')}>Done</Button>
            </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-on-surface">Behavioral Password Authentication</h1>
      <Card header={<h2 className="text-xl font-semibold">{step.charAt(0).toUpperCase() + step.slice(1)} Stage</h2>}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default BehavioralAuth;