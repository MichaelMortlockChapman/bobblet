export function Square({color = 'grey', size = "75px"}) {
  return (
    <svg viewBox="0 0 100 100" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="30" ry="30" fill={color} stroke="black"/>
    </svg>
  )
}

export function Circle({color = 'grey', size = "65px"}) {
  return (
    <svg viewBox="0 0 100 100" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <ellipse fill={color} stroke="black" cx="50" cy="50" rx="50" ry="50"/>
    </svg>
  )
}

export function Pentagon({color = 'grey', size = "55px"}) {
  return (
    <svg viewBox="0 0 100 100" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 0 L 100 38.197 L 80.902 100.001 L 19.098 100.001 L 0 38.197 Z" fill={color} stroke="black"/>
    </svg>
  )
}

export function Triangle({color = 'grey', size = "35px"}) {
  return (
    <svg viewBox="0 0 100 100" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M 38.461 11.111 Q 50 -11.111 61.538 11.111 L 96.154 77.778 Q 107.692 100 84.615 100 L 15.384 100 Q -7.693 100 3.846 77.778 Z" fill={color} stroke="black"/>
    </svg>
  )
}