export default function BoardStar({color = 'black', size = "100px"}, props) {
  return (<>
    <svg viewBox="0 0 100 100" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <path id="star" fill={color} stroke="black"
        d="M 
        20 50 
        0 0 
        50 20 
        100 0 
        80 50 
        100 100
        50 80
        0 100
        20 50
        "/>
    </svg>
  </>)
}