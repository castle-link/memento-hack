import { useState } from "react";
import styled from "styled-components";

const Textarea = ({
  id,
  action,
  disabled,
  height,
  margin,
  name,
  placeholder,
  type,
  value,
  width,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <Container
      id={id}
      disabled={disabled}
      onBlur={() => setFocus(false)}
      onChange={action}
      onFocus={() => setFocus(true)}
      focus={focus}
      height={height}
      margin={margin}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      width={width}
    />
  );
};

export default Textarea;

const Container = styled.textarea`
  background: #000;
  border: ${(props) =>
    props.focus
      ? "1px solid rgba(255,255,255,0.16)"
      : "1px solid rgba(255,255,255,0.16)"};
  color: #fff;
  height: ${(props) => (props.height ? props.height : "104px")};
  margin: ${(props) => (props.margin ? props.margin : "0px")};
  resize: none;
  padding: 8px 16px;
  transition: all 0.16s linear;
  width: ${(props) => (props.width ? props.width : "100%")};
`;
