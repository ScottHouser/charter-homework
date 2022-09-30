import React, { useState, useMemo } from 'react';
import { testData } from './TestData/testTransactions';
import moment from 'moment';
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

  console.log(memoizedResults)
  const makeCustomerTable = (obj) => {
    if(obj){
      return(
        Object.entries(obj).map((item) => {
          return(
            
            <div className='table-row' key={item[0]}>
              <div className='flex-one centered small-font'>{`${item[1].customerName}`}</div>
              <div className='flex-one centered small-font'>{Math.floor(item[1].pointsForPurchace)}</div>
              <div className='flex-one centered small-font'>{item[1].pointsThisMonth}</div>
              <div className='flex-one centered small-font'>{item[1].pointsLastMonth}</div>
              <div className='flex-one centered small-font'>{item[1].pointsTwoMonthsAgo}</div>
            </div>
          )
        })
      )
    }
  }

  const makeTableHeader = () => {
    const currentMonthName  = moment().format('MMMM');
    const lastMonthName = moment().startOf('month').subtract(1, 'months').format('MMMM');
    const twoMonthAgoName = moment().startOf('month').subtract(2, 'months').format('MMMM');

    return(
      <div className='table-row'>
        <div className='flex-one centered'>{`Customer`}</div>
        <div className='flex-one centered'>{`Points Total`}</div>
        <div className='flex-one centered'>{`${currentMonthName} points`}</div>
        <div className='flex-one centered'>{`${lastMonthName} points`}</div>
        <div className='flex-one centered'>{`${twoMonthAgoName} points`}</div>
      </div>
    )
  }

  return (
    <div className="App-container">
      <header className="App-header">
        
          {makeTableHeader()}
          {makeCustomerTable(memoizedResults)}
          {returnLoadButton()}
          {returnLoadingIndicator()}
        
      </header>
    </div>
  );
}

const returnCustomerMap = (array) => {
  //object map = {key: {pointsTotal: number, customerName: string, pointsThisMonth: number, pointsLastMonth: number, points2lastMonth: number}}

  let returnMap = {}

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

  const calculatePointsByMonth = (time, key, isNew, purchaceValue) =>{
    const startOfThisMonth = moment().startOf('month').unix();
    const startOfLastMonth = moment().startOf('month').subtract(1, 'months').unix();
    const startOfTwoMonthAgo = moment().startOf('month').subtract(2, 'months').unix();

    if(time > startOfThisMonth){
      if(isNew){
        returnMap[key].pointsThisMonth = Math.floor(calculatePointsForPurchace(purchaceValue))
        returnMap[key].pointsLastMonth = 0;
        returnMap[key].pointsTwoMonthsAgo = 0;
      }else{
        let prevTotal = returnMap[key].pointsThisMonth || 0
        returnMap[key].pointsThisMonth = Math.floor(prevTotal + calculatePointsForPurchace(purchaceValue))
      }
    }else if(time > startOfLastMonth && time < startOfThisMonth){
      if(isNew){
        returnMap[key].pointsLastMonth = Math.floor(calculatePointsForPurchace(purchaceValue))
        returnMap[key].pointsThisMonth = 0;
        returnMap[key].pointsTwoMonthsAgo = 0;
      }else{
        let prevTotal = returnMap[key].pointsLastMonth || 0
        returnMap[key].pointsLastMonth = Math.floor(prevTotal + calculatePointsForPurchace(purchaceValue))
      }
    }else if(time > startOfTwoMonthAgo && time < startOfLastMonth){
      if(isNew){
        returnMap[key].pointsTwoMonthsAgo = Math.floor(calculatePointsForPurchace(purchaceValue))
        returnMap[key].pointsThisMonth = 0;
        returnMap[key].pointsLastMonthsAgo = 0;
      }else{
        let prevTotal = returnMap[key].pointsTwoMonthsAgo || 0
        returnMap[key].pointsTwoMonthsAgo = Math.floor(prevTotal + calculatePointsForPurchace(purchaceValue))
      }
    }else{

    }
  }

  if(array.length > 0) {
    array.forEach(object => {
      let pointsForPurchace = Math.floor(calculatePointsForPurchace(object.purchaceTotal))
      if(!returnMap.hasOwnProperty(object.customerId)){
        returnMap[object.customerId] = {pointsForPurchace: pointsForPurchace, customerName: object.customerName};
        calculatePointsByMonth(object.transactionTime, object.customerId, true, object.purchaceTotal)
      }else{
        let prevTotal = Math.floor(returnMap[object.customerId].pointsForPurchace)
        returnMap[object.customerId].pointsForPurchace =  Math.floor(prevTotal + pointsForPurchace)
        calculatePointsByMonth(object.transactionTime, object.customerId, false, object.purchaceTotal)
      }
    })
  }

  return returnMap
}

export default App;
