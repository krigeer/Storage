export default function Button({ onClick, children }) {
    return (
        <button 
            className="btn btn-modern w-100 mt-3 bg-v"
            onClick={onClick} >
            {children}
        </button>
    );
}