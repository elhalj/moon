import { MessageSquare } from "lucide-react"


function NoChatSelected() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon display */}
        <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex justify-center items-center animate-bounce">
                    <MessageSquare className="w-8 h-8 text-primary"/>
                </div>
            </div>
        </div>
        {/* Welcome text */}
        <h2 className="text-2xl font-bold">Welcome to MoonChat</h2>
        <p className="text-base-content/60">Select the conversation from the sideBare to start chat</p>
      </div>
    </div>
  )
}

export default NoChatSelected
