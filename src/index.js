import React from 'react'
import ReactDOM from 'react-dom'
import "./index.scss"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from './Button'

class Calculator extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            input: "0",
            output: "",
            lastchar: "",
            operandStack: [],
            operatorStack: [],
            collect: []
        }
        this.digits = [
            {text:"7", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "seven"},
            {text:"8", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "eight"},
            {text:"9", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "nine"},
            {text:"4", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "four"},
            {text:"5", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "five"},
            {text:"6", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "six"},
            {text:"1", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "one"},
            {text:"2", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "two"},
            {text:"3", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "three"},
            {text:"0", f: this.handleClick,style:{width: "121px",height: "60px"}, id: "zero"},
            {text:".", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "decimal"},
        ]
        this.operators = [
            {text:"AC", f: this.handleClick,style:{width: "121px",height: "60px"}, id: "clear"},
            {text:"/", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "divide"},
            {text:"x", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "multiply"},
            {text:"-", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "subtract"},
            {text:"+", f: this.handleClick,style:{width: "60px",height: "60px"}, id: "add"},
            {text:"=", f: this.handleClick,style:{width: "121px",height: "60px"},id: "equals"},
        ]
    }

    compute = (operandStack, operatorStack) => {
        this.precompute(operandStack, operatorStack)
        while( operatorStack.length){
            let op1 = operandStack.shift()
            op1 = this.isFloat(op1) ? parseFloat(op1) : parseInt(op1)
            let op2 = operandStack.shift()
            op2 = this.isFloat(op2) ? parseFloat(op2) : parseInt(op2)
            const operator = operatorStack.shift()
            switch(operator){
                case "+":
                    operandStack.unshift(String(op1 + op2))
                    break
                default:
                    operandStack.unshift(String(op1 - op2))
            }
        }
    }

    precompute = (operandStack, operatorStack) => {
        if(operatorStack.length && operatorStack[operatorStack.length - 1] === "x"){
            let op1 = operandStack.pop()
            op1 = this.isFloat(op1) ? parseFloat(op1) : parseInt(op1)
            let op2 = operandStack.pop()
            op2 = this.isFloat(op2) ? parseFloat(op2) : parseInt(op2)
            operandStack.push(String(op1 * op2))
            operatorStack.pop()
        }
        else if(operatorStack.length && operatorStack[operatorStack.length - 1] === "/"){
            let op1 = operandStack.pop()
            op1 = this.isFloat(op1) ? parseFloat(op1) : parseInt(op1)
            let op2 = operandStack.pop()
            op2 = this.isFloat(op2) ? parseFloat(op2) : parseInt(op2)
            operandStack.push(String(op2 / op1))
            operatorStack.pop()
        }
    }

    addToCollect = data => {
        let temp = [...this.state.collect]
        const operandStack = [...this.state.operandStack]
        const operatorStack = [...this.state.operatorStack]
        let output = this.state.output + data
        let input = this.state.input
        if(data === "="){
            operandStack.push(temp.join(""))
            this.compute(operandStack,operatorStack)
            output += operandStack[operandStack.length - 1]
            input = operandStack[operandStack.length - 1]
            temp = []
            console.log(operatorStack)
            console.log(operandStack)
        }
        else if(this.isOperator(data)){
            if(this.isOperator(this.state.lastchar)){
                if(data !== "-"){
                    if(this.state.lastchar === "-"){
                        temp = []
                    }
                    operatorStack.pop()
                    operatorStack.push(data)
                }
                else{
                    temp = [data]
                }
            }
            else{
                if(temp.length){
                    operandStack.push(temp.join(""))
                }
                this.precompute(operandStack, operatorStack)
                operatorStack.push(data)
                temp = []
                console.log(operatorStack)
                console.log(operandStack)
            }
        }
        else{
            temp.push(data)
        }

        if(temp[0]==="."){
            temp.unshift("0")
        }
        if(data !== "=" && !this.isOperator(this.state.lastchar)){
            input = temp.length ?temp.join("") : this.state.input
        }
        this.setState({
            ...this.state,
            collect: temp,
            operandStack,
            operatorStack,
            input,
            output,
            lastchar: data
        })
    }

    handleClick = e => {
        if(e!== "AC"){
            if(e==="."){
                if(this.state.collect.find(elt => elt===".") === undefined){
                    this.addToCollect(e)
                }
            }
            else{
                if((e==="0" && !this.startWithZeros()) || e !== "0")
                    this.addToCollect(e)
            }
            
        }
        else{
            this.reset()
        }
    }

    formatOutput = () => {
        const out = this.state.collect.reduce((result,elt)=>{
            return result + elt
        },"")
        return out
    }

    isOperator = str => {
        return ["/","x","-","+"].filter(elt=>elt===str).length ? true: false
    }

    isFloat = data => {
        const regex = /[.]/
        return regex.test(data)
    }

    reset = () => {
        this.setState({
            ...this.state,
            input: "0",
            output: "",
            lastchar: "",
            operandStack: [],
            operatorStack: [],
            collect: []
        })
    }

    startWithZeros = () => {
        let cpt = 0;
        this.state.collect.forEach(elt => {
            cpt += elt==="0" ? 1 : 0
        })
        if(this.state.collect.length >= 1 && cpt === this.state.collect.length)
            return true
        return false
    }
    
    render(){
        return (
            <div className="container fluid mt-4">
                <h1 className="text-muted text-center">Calculator</h1>
                <div className="content bg-secondary">
                    <div className="top-content">
                        <div id="output" className="text-right pr-1 text-secondary">{this.state.output} </div>
                        <div id="display" className="text-right pr-1">{this.state.input}</div>
                    </div>
                    <div className="bottom-content">
                        <div className="numbers">
                            {this.digits.map((elt,index) => (
                                <Button text={elt.text} handleClick={elt.f} key={index} style={elt.style} id={elt.id} />
                            ))}
                        </div>
                        <div className="operators">
                            {
                                this.operators.map((elt,index) =>(
                                    <Button text={elt.text} handleClick={elt.f} key={index} style={elt.style} id={elt.id} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

ReactDOM.render(
    <Calculator />,
    document.querySelector("#root")
)
