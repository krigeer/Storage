export default function Card(props){
    return(
            <StatCard
               icon={props.icono}
               title={props.titulo}
               description={props.descripcion}
               value={props.valor}
               color={props.color}
            />
    )
}