import { useState } from 'react';
import './App.scss';
import Buttons from './components/Buttons';
import Formula from './components/Formula';
import Output from './components/Output';

function App() {
        const isOperator = /[x/+‑]/,  endsWithOperator = /[x+‑/]$/, endsWithNegativeSign = /\d[x/+‑]{1}‑$/

        const [currentVal, setCurrentVal] = useState("0")
        const [prevVal, setPrevVal] = useState("0")
        const [formula, setFormula] = useState("")
        // eslint-disable-next-line
        const [currentSign, setCurrentSign] = useState("pos")
        // eslint-disable-next-line
        const [lastClicked, setLastClicked] = useState("")
        const [evaluated, setEvaluated] = useState(false)

        const maxDigitWarning=()=>{
                setCurrentVal("Digit Limit Met")
                setPrevVal(currentVal)
                setTimeout(()=>{setCurrentVal(prevVal)},1000)
        }

        const handleEvaluate=()=>{
                if (!currentVal.includes('Limit')) {
                        let expression = formula;
                        while (endsWithOperator.test(expression)) {
                                expression = expression.slice(0, -1);
                        }
                        expression = expression.replace(/x/g, '*').replace(/‑/g, '-').replace('--', '+0+0+0+0+0+0+');
                        // eslint-disable-next-line
                        let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
                        if (answer.toString()==="NaN"){ setTimeout(()=>{initialize()},2000)}
                        setCurrentVal(answer.toString())
                        setFormula(expression.replace(/\*/g, '⋅').replace(/-/g, '‑').replace('+0+0+0+0+0+0+', '‑-').replace(/(x|\/|\+)‑/, '$1-').replace(/^‑/, '-') + '=' +answer)
                        setPrevVal(answer)
                        setEvaluated(true)
                }
        }

        const handleOperators=(e)=>{
                if(!currentVal.includes("Limit")){
                        const val=e.target.value
                        setCurrentVal(val)
                        setEvaluated(false)
                        if (evaluated) {
                                setFormula(prevVal + val) 
                        }
                        else if (!endsWithOperator.test(formula)) {
                                setPrevVal(formula)
                                setFormula(formula + val)
                        } 
                        else if (!endsWithNegativeSign.test(formula)) {
                                setFormula( (endsWithNegativeSign.test(formula + val) ? formula : prevVal) + val)
                        } 
                        else if (val !== '‑') {
                                setFormula(prevVal + val)
                        }
                }
        }

        const handleNumbers=(e)=>{
                if(!currentVal.includes("Limit")){
                        const val = e.target.value;
                        setEvaluated(false)
                        if (currentVal.length > 21) {
                                maxDigitWarning();
                        } 
                        else if (evaluated) {
                                setCurrentVal(val)
                                setFormula(val !== '0' ? val : '')
                        } 
                        else {
                                setCurrentVal(currentVal === '0' || isOperator.test(currentVal)? val : currentVal + val)
                                setFormula(currentVal === '0' && val === '0' ? formula === ''  ? val : formula : /([^.0-9]0|^0)$/.test(formula) ? formula.slice(0, -1) + val : formula + val)
                        }
                }
        }

        const handleDecimal=()=>{
                if(evaluated === true){
                        setCurrentVal('0.')
                        setFormula('0.')
                        setEvaluated(false)
                }
                else if ( !currentVal.includes('.') && ! currentVal.includes('Limit')) {
                        setEvaluated(false)
                        if (currentVal.length > 21) {
                                maxDigitWarning();
                        } 
                        else if (endsWithOperator.test(formula) || (currentVal === '0' && formula === '')) {
                                setCurrentVal('0.')
                                setFormula(formula + '0.')
                        } 
                        else {
                                setCurrentVal(formula.match(/(-?\d+\.?\d*)$/)[0] + '.',)
                                setFormula(formula + '.')
                        }
                }
        }

        const initialize=()=>{
                setCurrentVal( '0')
                setPrevVal('0')
                setFormula('')
                setCurrentSign('pos')
                setLastClicked('')
                setEvaluated(false)
        }

  return (
    <div className="App">
                <div className="cal">
                        <Formula formula={formula.replace(/x/g, '⋅')} />
                        <Output currentValue={currentVal} />
                        <Buttons
                        decimal={handleDecimal}
                        evaluate={handleEvaluate}
                        initialize={initialize}
                        numbers={handleNumbers}
                        operators={handleOperators}
                        />
                </div>
                <div className="credits">
                        Code By <br />
                        <a href="https://ogooluwanick-portfolio.netlify.app/" target="_blank" rel="noreferrer" >
                                Ogooluwanick
                        </a>
                </div>
    </div>
  );
}

export default App;
