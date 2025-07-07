import { Link } from "react-router";
const FriendCard = ({friend}) => {
  return (
   <div className="h-full">
  <div className="card bg-base-200 hover:shadow-md transition-shadow h-full flex flex-col">
    <div className="card-body p-4 flex flex-col flex-1 justify-between">
      {/* USER INFO */}
      <div className="flex items-center gap-3 mb-3">
        <div className="avatar size-12 shrink-0 rounded-full overflow-hidden">
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="font-semibold truncate">{friend.fullName}</h3>
      </div>

      {/* Language badges */}
      <div className="flex gap-1.5 mb-3">
  <span className="badge badge-secondary text-xs max-w-[50%] truncate">
    Core: {friend.coreLanguage}
  </span>
  <span className="badge badge-outline text-xs max-w-[50%] truncate">
    Learning: {friend.learningLanguage}
  </span>
</div>
    <span>{friend.location}</span>
      {/* Action Button */}
      <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full mt-auto">
        Message
      </Link>
    </div>
  </div>
</div>

  )
}

export default FriendCard
