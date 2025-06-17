import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button path

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Our Modern Web Application
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Manage your users efficiently with a powerful Laravel API backend and a responsive React frontend powered by ShadCN UI.
      </p>
      <div className="flex space-x-4">
        <Link to="/login">
          <Button size="lg">Sign In</Button>
        </Link>
        <Link to="/register">
          <Button size="lg" variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
      <p className="mt-12 text-sm text-gray-500">
        Built with Laravel, React, ShadCN UI, and MongoDB Atlas.
      </p>
    </div>
  );
}
