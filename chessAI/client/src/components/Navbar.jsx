import './Navbar.css'; // Import the CSS for styling

const Navbar = () => {
    return (
        <nav className="navbar" id="navbar">
            <div className="navbar-title">ChessAI</div>
            <div className="navbar-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#tutorials">Tutorials</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
