//estados só podem ser tratados com constantes. O estado compõe de um objeto
// e uma função para setar o objeto. useState é uma função do React para
// lidar com o estados do objeto
  
import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps){
  return(
    <button 
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props} />
  )
}