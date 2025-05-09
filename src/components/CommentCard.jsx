import React from 'react';

export default function CommentCard({ comentario }) {
  return (
    <div className="bg-white/80 border border-gray-200 backdrop-blur-md shadow-md rounded-xl p-4 text-black dark:bg-white/10 dark:border-white/10 dark:text-white transition space-y-2">
      <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.953 9.953 0 0012 20c2.485 0 4.77-.91 6.515-2.414M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {comentario.username}
      </h3>
      <p className="text-gray-800 dark:text-gray-200">{comentario.content}</p>
    </div>
  );
}
