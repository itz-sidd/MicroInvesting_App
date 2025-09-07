import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { useRiskAssessment, RiskAssessmentQuestion } from '@/hooks/useRiskAssessment';

interface RiskAssessmentWizardProps {
  onComplete?: () => void;
}

export function RiskAssessmentWizard({ onComplete }: RiskAssessmentWizardProps) {
  const { 
    questions, 
    responses, 
    loading, 
    updateResponse, 
    submitAssessment, 
    assessment 
  } = useRiskAssessment();
  
  console.log('RiskAssessmentWizard - assessment:', assessment, 'loading:', loading);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = responses[currentQuestion?.id];
  const allQuestionsAnswered = Object.keys(responses).length === questions.length;

  const handleAnswerSelect = (questionId: string, value: string) => {
    updateResponse(questionId, parseInt(value));
  };

  const handleNext = () => {
    if (isLastQuestion && allQuestionsAnswered) {
      handleSubmit();
    } else if (canProceed && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await submitAssessment();
    setIsSubmitting(false);
    
    if (success && onComplete) {
      onComplete();
    }
  };

  // Show completion state if assessment exists
  if (assessment) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Risk Assessment Complete!</CardTitle>
          <CardDescription>
            Your investment profile has been analyzed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Risk Profile</h3>
              <Badge variant="secondary" className="text-lg px-6 py-2 capitalize">
                {assessment.risk_category} Risk Tolerance
              </Badge>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(assessment.risk_score * 100)}/100
                </span>
              </div>
              <Progress value={assessment.risk_score * 100} className="h-2" />
            </div>

            <div className="text-left space-y-2">
              <h4 className="font-medium">What this means:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {assessment.risk_category === 'conservative' && (
                  <>
                    <li>• Focus on capital preservation and steady income</li>
                    <li>• Emphasis on bonds and stable dividend stocks</li>
                    <li>• Lower volatility, more predictable returns</li>
                  </>
                )}
                {assessment.risk_category === 'moderate' && (
                  <>
                    <li>• Balanced approach between growth and stability</li>
                    <li>• Mix of stocks, bonds, and diversified ETFs</li>
                    <li>• Moderate volatility with growth potential</li>
                  </>
                )}
                {assessment.risk_category === 'aggressive' && (
                  <>
                    <li>• Focus on maximum growth potential</li>
                    <li>• Heavy weighting in stocks and growth assets</li>
                    <li>• Higher volatility but greater return potential</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Retake Assessment
            </Button>
            <Button onClick={onComplete} className="flex-1">
              <Target className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {currentQuestion.category.replace('_', ' ')}
          </Badge>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        <CardDescription>
          Choose the option that best describes your situation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup
          value={responses[currentQuestion.id]?.toString() || ''}
          onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          className="space-y-4"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.value} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={option.value.toString()} />
                <Label 
                  htmlFor={option.value.toString()} 
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option.label}
                </Label>
              </div>
              {option.description && (
                <p className="text-sm text-muted-foreground ml-6">
                  {option.description}
                </p>
              )}
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed || loading || isSubmitting}
          >
            {isLastQuestion ? (
              isSubmitting ? 'Submitting...' : 'Complete Assessment'
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}