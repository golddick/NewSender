// app/unsubscribe/success/page.tsx
export default function UnsubscribeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Unsubscribed Successfully
        </h1>
        <p className="text-gray-700 mb-6">
          You have been successfully removed from this mailing list.
        </p>
        <p className="text-sm text-gray-500">
          We&apos;re sorry to see you go. You can resubscribe at any time if you change your mind.
        </p>
      </div>
    </div>
  );
}
