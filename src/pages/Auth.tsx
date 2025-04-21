
import React from 'react';
import AuthContainer from '@/components/Auth/AuthContainer';

const Auth: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-50 p-4">
      <div className="text-center mb-8 animate-enter">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
          MindNotes
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered note taking assistant
        </p>
      </div>
      <AuthContainer />
    </div>
  );
};

export default Auth;
