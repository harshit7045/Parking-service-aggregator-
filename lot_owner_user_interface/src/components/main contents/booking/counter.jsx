import * as React from 'react';
import { unstable_useNumberInput as useNumberInput } from '@mui/base/unstable_useNumberInput';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Cookies from 'js-cookie';

const CompactNumberInput = React.forwardRef(  function CompactNumberInput(props, ref) {
  const {
    getRootProps,
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput(props);
  const { value, onChange, name, object, serverMessage } = props;
  const inputProps = getInputProps();

  inputProps.ref = useForkRef(inputProps.ref, ref);
  //console.log("object" + object);
  return (
    <StyledInputRoot {...getRootProps()}>
      <StyledStepperButton className="increment" {...getIncrementButtonProps()}>
      <ArrowDropUpRoundedIcon onClick={async () =>object=="online"?await callIncreaseOnline(name,serverMessage,value):await callIncreaseiot(name,serverMessage,value) }  />

      </StyledStepperButton>
      <StyledStepperButton className="decrement" {...getDecrementButtonProps()}>
        <ArrowDropDownRoundedIcon  onClick={async () => object=="online"?await callIncreaseiot(name,serverMessage,value):await callIncreaseOnline(name,serverMessage,value)} />
      </StyledStepperButton>
      <HiddenInput {...inputProps} />
    </StyledInputRoot>
  );
});

export default  function UseNumberInputCompact( { lotno,name,object,serverMessage } ) {
  const [value, setValue] = React.useState(null);
  const [name1, setName] = React.useState(null);
  const [object1, setObject] = React.useState(null);
  const [serverMessage1, setServerMessage] = React.useState(null);
  //console.log(lotno,name,object);
  React.useEffect(() => {
    setValue(lotno);
    setName(name);
    setObject(object);
    setServerMessage(serverMessage);
  }, [lotno, name, object, serverMessage]); // Dependency array
  
  
  return (
    
    <Layout>
      <CompactNumberInput
        aria-label="Compact number input"
        placeholder="Type a number…"
        readOnly
        value={value}
        onChange={(event, val) => setValue(val)}
        name={name1}
        object={object1}
        serverMessage={serverMessage1}
      />
      <Pre>Current value: {value ?? ' '} 
        
      </Pre>
    </Layout>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: 2rem;
    grid-template-rows: 2rem 2rem;
    grid-template-areas:
      "increment"
      "decrement";
    row-gap: 1px;
    overflow: auto;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
  `,
);

const HiddenInput = styled('input')`
  visibility: hidden;
  position: absolute;
`;

const StyledStepperButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: nowrap;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  color: inherit;
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? blue[700] : blue[500]};
    color: ${grey[50]};
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &.increment {
    grid-area: increment;
  }

  &.decrement {
    grid-area: decrement;
  }
`,
);

const Layout = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  column-gap: 0.5rem;
`;

const Pre = styled('pre')`
  font-size: 0.75rem;
`;
async function callIncreaseOnline(name,serverMessage,value) { 
                       //console.log(serverMessage)  
                       
  
  //console.log(name);
  //console.log("call increase");
  const response =await fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parking/increaseonlinelot`, { 
    method: 'PATCH',
    body: JSON.stringify({ name : name}),
    headers: {
      'Content-Type': 'application/json',
      "authorization": Cookies.get("ownertoken"),
    } 
    });
    const data = await response.json();
    //console.log(data);

}
async function callIncreaseiot(name) { 
  //console.log(name);
  //console.log("call increase");
  const response =await fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parking/increaseiotlot`, { 
    method: 'PATCH',
    body: JSON.stringify({ name : name}),
    headers: {
      'Content-Type': 'application/json',
      "authorization": Cookies.get("ownertoken"),
    } 
    });
    const data = await response.json();
    //console.log(data);

}