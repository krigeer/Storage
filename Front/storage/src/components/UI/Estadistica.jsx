const Estadistica = ({estadisticas}) => {
    return (
        <div className="row g-4 mb-5">
        {estadisticas.map((item, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body d-flex align-items-center gap-3">
                {item.icon}
                <div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <span className="text-muted">{item.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
}

export default Estadistica