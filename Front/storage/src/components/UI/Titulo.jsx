const Titulo = ({titulo, descripcion}) => {
    return (
            <div className="text-center mb-5">
                <h1 className="fw-bold main-title">{titulo}</h1>
                <p className="subtitle">{descripcion}</p>
            </div>
    )
};

export default Titulo;





