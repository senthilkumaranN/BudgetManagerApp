import {View, Text, SafeAreaView, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AccountsScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [bankaccountbalance, setBankaccountbalance] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(
        'https://budgetmanagerapp.onrender.com/api/expense/get',
      );
      setExpenses(response.data);
    } catch (error) {
      console.log('FetchAllData', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const totalExpense = expenses
    .filter(expense => expense.type === 'Expense')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalIncome = expenses
    .filter(expense => expense.type === 'Income')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalSpentCash = expenses
    .filter(expense => expense.type === 'Income' && expense.account === 'Cash')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalExpenseSpentCash = expenses
    .filter(expense => expense.type === 'Expense' && expense.account === 'Cash')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalcardAmount = expenses
    .filter(expense => expense.type === 'Income' && expense.account === 'Card')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalcardBalance = expenses
    .filter(expense => expense.type === 'Expense' && expense.account === 'Card')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const calculateTotalBankBalance = () => {
    let bankbalance = 0;

    expenses?.forEach(element => {
      const {account, amount, type} = element;

      const numericAmount = parseFloat(amount);

      if (account === 'Bank Accounts') {
        if (type === 'Expense') {
          bankbalance -= numericAmount;
        } else if (type === 'Income') {
          bankbalance += numericAmount;
        }
      }
    });

    setBankaccountbalance(bankbalance);
  };

  useEffect(() => {
    calculateTotalBankBalance();
  }, [expenses]);

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <SafeAreaView>
      <View style={{backgroundColor: 'white', padding: 10}}>
        <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>
          Accounts
        </Text>
      </View>
      <View style={{borderColor: '#E0E0E0', borderWidth: 0.4}} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 12,
            paddingBottom: 12,
            justifyContent: 'space-around',
            backgroundColor: 'white',
          }}>
          <View>
            <Text
              style={{
                fontWeight: '500',
                color: '#004953',
                textAlign: 'center',
              }}>
              Assets
            </Text>
            <Text
              style={{
                marginTop: 5,
                textAlign: 'center',
                color: '#0578eb',
                fontSize: 15,
                fontWeight: '500',
              }}>
              ₹{totalIncome.toFixed(2)}
            </Text>
          </View>

          <View>
            <Text style={{fontWeight: '500', color: '#004953'}}>
              Liabilities
            </Text>
            <Text
              style={{
                marginTop: 5,
                textAlign: 'center',
                color: '#eb6105',
                fontSize: 15,
                fontWeight: '500',
              }}>
              ₹{totalExpense.toFixed(2)}
            </Text>
          </View>

          <View>
            <Text
              style={{
                fontWeight: '500',
                color: '#004953',
                textAlign: 'center',
              }}>
              Total Balance
            </Text>
            <Text
              style={{
                marginTop: 5,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: '500',
              }}>
              ₹{Number(totalIncome - totalExpense).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{borderColor: '#E0E0E0', borderWidth: 0.8}} />

        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
            }}>
            <Text>Income Cash</Text>
            <Text style={{color: '#eb6105'}}>₹{totalSpentCash.toFixed(2)}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
            }}>
            <Text>Expense Cash</Text>
            <Text style={{color: '#eb6105'}}>
              ₹{totalExpenseSpentCash.toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
            }}>
            <Text>Accounts</Text>
            <Text style={{color: '#0578eb'}}>
              ₹{Number(bankaccountbalance).toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              backgroundColor: 'white',
            }}>
            <Text>Bank Accounts</Text>
            <Text style={{color: '#0578eb'}}>
              ₹{Number(bankaccountbalance).toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
            }}>
            <Text>Income CardAmount</Text>
            <Text>₹{totalcardAmount.toFixed(2)}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              backgroundColor: 'white',
            }}>
            <Text>Expense CardAmount</Text>
            <Text>₹{totalcardBalance.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountsScreen;
