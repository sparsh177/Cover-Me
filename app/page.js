"use client"
import React,{useState} from "react"
import OpenAI from "openai"


const openai=new OpenAI({
  apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser:true,
})

export default function Home() {
  const [userInput,setUserInput]=useState('');
  const[chatHistory,setChatHistory]=useState([]);
  const[isLoading, setIsLoading]=useState(false);

  const handleUserInput =async ()=>{
    setIsLoading(true);
    setChatHistory((prevChat)=>[
      ...prevChat,
      {role:'user',content:userInput},
    ]);

    const chatCompletion = await openai.chat.completions.create({
      messages: [...chatHistory, { role: 'assistant', content: userInput }],
      model: 'gpt-3.5-turbo-1106',
   });
    setChatHistory((prevChat)=>[
      ...prevChat,
      { role:'assistant',content:chatCompletion.choices[0].message.content},
    ]);

    setUserInput('');
    setIsLoading(false);
  }



  
  return (
    <div className=" animate pulse bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 min-h-screen flex flex-col justify-center items-center">
      <div className=" w-full max-w-screen-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="text-4xl font-bold text-pink-600 mb-2">
          Cover ME (AI Assistant Chatbox)
          </div>
          <p className="text-gray-700 text-lg">
            Welcome to the world of intelligent conversation!
          </p>
        </div>

        <div className="mb-6" style={{ height: "400px", overflow: 'auto' }}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'} mb-4`}>
              <div className={`rounded-full p-3 max-w-md mx-4 inline-block ${message.role === 'user' ? 'bg-indigo-300 text-indigo-800' : 'bg-teal-300 text-teal-800'}`}>
                {message.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className={`max-w-md mx-4 my-2 inline-block ${message.role === 'user' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'} p-3 rounded-md`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Ask me something..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:border-teal-500 bg-white"
          />
          {isLoading ? (
            <div className="bg-teal-500 text-white p-3 rounded-r-lg animate-pulse">
              Loading...
            </div>
          ) : (
            <button
              onClick={handleUserInput}
              className="bg-teal-500 text-white p-3 rounded-r-lg hover:bg-teal-600 focus:outline-none"
            >
              Ask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}