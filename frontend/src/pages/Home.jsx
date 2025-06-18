import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-muted">
      <Card className="w-full max-w-xs p-8 shadow-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          User Manager
        </h1>
        <div className="flex space-x-4 w-full justify-center">
          <Link to="/login" className="w-1/2">
            <Button size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link to="/register" className="w-1/2">
            <Button size="lg" variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
