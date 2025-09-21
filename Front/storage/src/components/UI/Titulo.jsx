const Titulo = ({titulo, descripcion}) => {
    return (
            <div className="text-center mb-5">
                <h1 className="fw-bold text-dark">{titulo}</h1>
                <p className="text-muted">{descripcion}</p>
            </div>
    )
};

export default Titulo;
