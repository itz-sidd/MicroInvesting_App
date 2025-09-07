import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface RiskAssessmentQuestion {
  id: string;
  question: string;
  options: { value: number; label: string; description?: string }[];
  category: 'risk_tolerance' | 'investment_experience' | 'time_horizon' | 'financial_goals';
}

export interface RiskAssessmentResponse {
  questionId: string;
  answer: number;
}

export interface RiskAssessment {
  id?: string;
  user_id: string;
  question_responses: Record<string, number>;
  risk_score: number;
  risk_category: 'conservative' | 'moderate' | 'aggressive';
  completed_at: string;
}

const RISK_ASSESSMENT_QUESTIONS: RiskAssessmentQuestion[] = [
  {
    id: 'risk_comfort',
    question: 'How comfortable are you with investment risk?',
    category: 'risk_tolerance',
    options: [
      { value: 1, label: 'Very Low', description: 'I want to preserve my capital above all else' },
      { value: 2, label: 'Low', description: 'I prefer safer investments with modest returns' },
      { value: 3, label: 'Moderate', description: 'I can accept some risk for potentially better returns' },
      { value: 4, label: 'High', description: 'I am comfortable with significant risk for higher returns' },
      { value: 5, label: 'Very High', description: 'I actively seek high-risk, high-reward investments' }
    ]
  },
  {
    id: 'investment_experience',
    question: 'What is your investment experience?',
    category: 'investment_experience',
    options: [
      { value: 1, label: 'Beginner', description: 'I have little to no investment experience' },
      { value: 2, label: 'Some Experience', description: 'I have invested in basic products like savings accounts' },
      { value: 3, label: 'Moderate Experience', description: 'I have experience with stocks and bonds' },
      { value: 4, label: 'Experienced', description: 'I actively manage a diversified portfolio' },
      { value: 5, label: 'Expert', description: 'I have extensive experience with complex investments' }
    ]
  },
  {
    id: 'time_horizon',
    question: 'What is your investment time horizon?',
    category: 'time_horizon',
    options: [
      { value: 1, label: 'Less than 1 year', description: 'I need access to funds very soon' },
      { value: 2, label: '1-3 years', description: 'Short-term goals like vacation or car' },
      { value: 3, label: '3-7 years', description: 'Medium-term goals like house down payment' },
      { value: 4, label: '7-15 years', description: 'Long-term goals like children\'s education' },
      { value: 5, label: 'More than 15 years', description: 'Retirement or long-term wealth building' }
    ]
  },
  {
    id: 'portfolio_volatility',
    question: 'If your portfolio lost 20% in a month, what would you do?',
    category: 'risk_tolerance',
    options: [
      { value: 1, label: 'Sell everything immediately', description: 'I cannot tolerate any losses' },
      { value: 2, label: 'Sell some investments', description: 'I would reduce my risk exposure' },
      { value: 3, label: 'Hold steady', description: 'I would wait for recovery' },
      { value: 4, label: 'Buy more', description: 'I would see it as a buying opportunity' },
      { value: 5, label: 'Leverage up', description: 'I would increase my position aggressively' }
    ]
  },
  {
    id: 'income_stability',
    question: 'How stable is your income?',
    category: 'financial_goals',
    options: [
      { value: 1, label: 'Very unstable', description: 'My income varies significantly month to month' },
      { value: 2, label: 'Somewhat unstable', description: 'My income has some variability' },
      { value: 3, label: 'Stable', description: 'My income is generally predictable' },
      { value: 4, label: 'Very stable', description: 'I have a steady salary or pension' },
      { value: 5, label: 'Multiple sources', description: 'I have diversified income streams' }
    ]
  },
  {
    id: 'emergency_fund',
    question: 'Do you have an emergency fund?',
    category: 'financial_goals',
    options: [
      { value: 1, label: 'No emergency fund', description: 'I have no savings for emergencies' },
      { value: 2, label: '1-2 months expenses', description: 'I have minimal emergency savings' },
      { value: 3, label: '3-4 months expenses', description: 'I have some emergency coverage' },
      { value: 4, label: '6+ months expenses', description: 'I have adequate emergency fund' },
      { value: 5, label: '12+ months expenses', description: 'I have extensive emergency coverage' }
    ]
  },
  {
    id: 'investment_knowledge',
    question: 'How well do you understand investment concepts?',
    category: 'investment_experience',
    options: [
      { value: 1, label: 'Minimal knowledge', description: 'I know very little about investing' },
      { value: 2, label: 'Basic knowledge', description: 'I understand savings accounts and CDs' },
      { value: 3, label: 'Moderate knowledge', description: 'I understand stocks, bonds, and mutual funds' },
      { value: 4, label: 'Advanced knowledge', description: 'I understand diversification and risk management' },
      { value: 5, label: 'Expert knowledge', description: 'I understand complex strategies and derivatives' }
    ]
  },
  {
    id: 'investment_goals',
    question: 'What is your primary investment goal?',
    category: 'financial_goals',
    options: [
      { value: 1, label: 'Capital preservation', description: 'Protect my money from inflation' },
      { value: 2, label: 'Income generation', description: 'Generate steady income from investments' },
      { value: 3, label: 'Balanced growth', description: 'Moderate growth with some income' },
      { value: 4, label: 'Capital appreciation', description: 'Grow my wealth over time' },
      { value: 5, label: 'Aggressive growth', description: 'Maximum growth potential' }
    ]
  }
];

export function useRiskAssessment() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const fetchLatestAssessment = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_risk_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching risk assessment:', error);
        return;
      }

      if (data) {
        setAssessment(data as RiskAssessment);
        setResponses(data.question_responses as Record<string, number>);
      }
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (responses: Record<string, number>): { score: number; category: 'conservative' | 'moderate' | 'aggressive' } => {
    const values = Object.values(responses);
    if (values.length === 0) return { score: 0, category: 'moderate' };

    const totalScore = values.reduce((sum, value) => sum + value, 0);
    const averageScore = totalScore / values.length;
    const normalizedScore = (averageScore - 1) / 4; // Normalize to 0-1 scale

    let category: 'conservative' | 'moderate' | 'aggressive';
    if (normalizedScore <= 0.33) {
      category = 'conservative';
    } else if (normalizedScore <= 0.66) {
      category = 'moderate';
    } else {
      category = 'aggressive';
    }

    return { score: normalizedScore, category };
  };

  const updateResponse = (questionId: string, answer: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitAssessment = async (): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to submit assessment');
      return false;
    }

    if (Object.keys(responses).length < RISK_ASSESSMENT_QUESTIONS.length) {
      toast.error('Please answer all questions before submitting');
      return false;
    }

    try {
      setLoading(true);
      const { score, category } = calculateRiskScore(responses);

      const { data, error } = await supabase
        .from('user_risk_assessments')
        .insert({
          user_id: user.id,
          question_responses: responses,
          risk_score: score,
          risk_category: category,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting risk assessment:', error);
        toast.error('Failed to submit risk assessment');
        return false;
      }

      setAssessment(data as RiskAssessment);
      toast.success(`Risk assessment completed! You are classified as ${category} risk tolerance.`);
      return true;
    } catch (error) {
      console.error('Error submitting risk assessment:', error);
      toast.error('Failed to submit risk assessment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setResponses({});
    setAssessment(null);
  };

  useEffect(() => {
    if (user) {
      fetchLatestAssessment();
    }
  }, [user]);

  return {
    assessment,
    responses,
    loading,
    questions: RISK_ASSESSMENT_QUESTIONS,
    updateResponse,
    submitAssessment,
    resetAssessment,
    fetchLatestAssessment,
    calculateRiskScore
  };
}