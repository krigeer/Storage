const Estadistica = ({estadisticas}) => {
  return (
      <div className="cards-layout-wrapper"> 
          {estadisticas.map((item, index) => (
              <div className="card" key={index}> 
                  <div className="card-statistic-body">
                      <div className="statistic-icon">{item.icon}</div> 
                      <div>
                          <h6 className="statistic-title">{item.title}</h6>
                          <span className="statistic-value">{item.value}</span> 
                      </div>
                  </div>
              </div>
          ))}
      </div>
  )
}

export default Estadistica;