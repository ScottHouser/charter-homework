import React, { useState, useMemo } from 'react';
import { testData } from './TestData/testTransactions'
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState('')
  const [customerData, setCustomerData] = useState([])
  const memoizedResults = useMemo(() => returnCustomerMap(customerData), [customerData]);

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
 const fakeApi = () => {
    let timeout = randomIntFromInterval(1000, 2000)
    console.log(timeout)
    setIsLoading(true)
    return new Promise(resolve => {
      setTimeout(() => resolve(testData), timeout);
    });
  };

  const callApi = async () => {
    const newText = await fakeApi();
    setCustomerData(newText)
    setIsLoading(false)
  };

  const returnLoadingIndicator = () => {
    if(isLoading){
      return 'Loading...'
    }else{
      return ''
    }
  }

  const returnLoadButton = () => {
    if(!isLoading && customerData.length < 1){
      return(
        <button
          className='app-button'
          onClick={()=>{callApi()}}
        >
          {'Load Customers'}
        </button>
      )
    }
  }

  const makeCustomerTable = (obj) => {
    if(obj){
      return(
        Object.entries(obj).map((item) => {
          return(
            <div className='table-row' key={item[0]}>
              <div className='flex'>{`${item[1].customerName} : `}</div>
              <div className='flex points-total'>{Math.floor(item[1].pointsForPurchace)}</div>
            </div>
          )
        })
      )
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {returnLoadButton()}
        {returnLoadingIndicator()}
        {makeCustomerTable(memoizedResults)}
      </header>
    </div>
  );
}

const returnCustomerMap = (array) => {

  const calculatePointsForPurchace = (total) => {
    const roundedTotal = Math.floor(total)
    const totalLessThan50 = roundedTotal < 50
    const totalMoreThan100 = roundedTotal > 100

    if(totalLessThan50){
      return 0
    }else if(totalMoreThan100){
      return 50 + ((total - 100) * 2)
    }else{
      return total - 50
    }
  }

  let returnMap = {}

  if(array.length > 0) {
    array.forEach(object => {
      let pointsForPurchace = calculatePointsForPurchace(object.purchaceTotal)
      if(!returnMap.hasOwnProperty(object.customerId)){
        returnMap[object.customerId] = {pointsForPurchace: pointsForPurchace, customerName: object.customerName};
      }else{
        let prevTotal = Math.floor(returnMap[object.customerId].pointsForPurchace)
        returnMap[object.customerId].pointsForPurchace =  Math.floor(prevTotal + pointsForPurchace)
      }
    })
  }

  return returnMap
}

export default App;
