export default function AssociateDetailsModel({ selectedPerson, setIsAssociateModalOpen }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Associated People</h3>
                    <button
                        onClick={() => setIsAssociateModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <img
                        src={selectedPerson?.ProfilePicture || ''}
                        className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                        alt="Profile"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedPerson?.Name || 'Associate Name'}</p>
                        <p className="text-xs text-gray-500">{selectedPerson?.Position || 'Associate Position'}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                    {selectedPerson?.About || 'No bio available.'}
                </p>
                {selectedPerson?.Email && (
                    <p className="text-sm pb-4">
                        Contact: <a href={`mailto:${selectedPerson?.Email || 'xyz@gmail.com'}`} className="text-[#2357C6] pl-2">{selectedPerson?.Email || 'Associate Email'}</a>
                    </p>
                )}
            </div>
        </div>
    )
}