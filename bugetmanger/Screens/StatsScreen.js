import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {TabBar, TabView} from 'react-native-tab-view';
import {PieChart} from 'react-native-svg-charts';

const StatsScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [index, setIndex] = useState(0);
  const [option, setOption] = useState('Stats');
  const [expenses, setExpenses] = useState([]);
  const date = currentDate.format('MMMM YYYY');
  const [refreshing, setRefreshing] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // 🔁 your data loading function
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://budgetmanagerapp.onrender.com/api/expense/getMonth',
        {
          params: {date},
        },
      );
      setExpenses(response.data);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const totalExpense = expenses
    .filter(expense => expense.type == 'Expense')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalIncome = expenses
    .filter(expense => expense.type == 'Income')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const [routes, setRoutes] = useState([
    {key: 'edit', title: `Income`},
    {key: 'view', title: 'Expense'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'edit':
        return <Income />;
      case 'view':
        return <Expense />;
    }
  };

  const RenderPieChart = () => {
    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

    const pieData = expenses
      .filter(expense => expense.type === 'Income') // Filter expenses of type "EXPENSE"
      .map((expense, index) => ({
        value: parseFloat(expense.amount), // Use the numerical amount as the value
        svg: {
          fill: randomColor(),
          onPress: () => console.log('press', index),
        },
        key: `pie-${index}`,
        category: expense.category,
        price: expense.amount,
      }));
    return (
      <View>
        <PieChart style={{height: 200}} data={pieData} />
        {pieData.map(data => (
          <View
            key={data.key}
            style={{
              padding: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <View
                  style={{
                    backgroundColor: data?.svg?.fill,
                    alignSelf: 'flex-start',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    width: 70,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {Math.round((data.value / totalIncome) * 100)}%
                  </Text>
                </View>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const RenderPieChartExpense = () => {
    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

    const pieData = expenses
      .filter(expense => expense.type == 'Expense')
      .map((expense, index) => ({
        value: parseFloat(expense.amount),
        svg: {
          fill: randomColor(),
          onPress: () => console.log('press', index),
        },
        key: `pie-${index}`,
        category: expense.category,
        price: expense.amount,
      }));

    return (
      <View style={{marginTop: 20}}>
        <PieChart style={{height: 200}} data={pieData} />

        {pieData?.map(data => (
          <View style={{padding: 12}} key={data.key}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <View
                  style={{
                    backgroundColor: data?.svg?.fill,
                    alignSelf: 'flex-start',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    width: 50,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {Math.round((data.value / totalExpense) * 100)}%
                  </Text>
                </View>

                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const Income = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{backgroundColor: 'white'}}>
      <View>
        {option == 'Budget' && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
              }}>
              <View>
                <Text style={{color: 'gray', fontSize: 15}}>
                  Remaining (Monthly)
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 19,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}>
                  ₹{totalIncome.toFixed(2)}
                </Text>
              </View>

              <View
                style={{
                  padding: 10,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text>Budget Setting</Text>
              </View>
            </View>

            {expenses
              ?.filter(item => item.type === 'Income')
              .map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderTopColor: '#E0E0E0',
                    borderTopWidth: 0.6,
                    padding: 14,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: '500'}}>{item?.category}</Text>
                    <Text>{Number(item?.amount).toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        )}

        {option == 'Stats' && (
          <View style={{marginVertical: 10}}>
            <RenderPieChart />
          </View>
        )}
      </View>
    </ScrollView>
  );

  const Expense = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{backgroundColor: 'white'}}>
      <View>
        {option == 'Budget' && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
              }}>
              <View>
                <Text style={{color: 'gray', fontSize: 15}}>
                  Remaining (Monthly)
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 19,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}>
                  ₹{totalExpense.toFixed(2)}
                </Text>
              </View>

              <View
                style={{
                  padding: 10,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text>Budget Setting</Text>
              </View>
            </View>

            {expenses
              ?.filter(item => item.type === 'Expense')
              .map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderTopColor: '#E0E0E0',
                    borderTopWidth: 0.6,
                    padding: 14,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: '500'}}>{item?.category}</Text>
                    <Text>{Number(item?.amount).toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        )}

        {option == 'Stats' && (
          <View>
            <RenderPieChartExpense />
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 12}}>
        <View
          style={{
            backgroundColor: '#E0E0E0',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            borderRadius: 12,
          }}>
          <Pressable
            onPress={() => setOption('Stats')}
            style={{
              backgroundColor: option == 'Stats' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Stats' ? 'orange' : '#606060',
              }}>
              Stats
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Budget')}
            style={{
              backgroundColor: option == 'Budget' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Budget' ? 'orange' : '#606060',
              }}>
              Budget
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Note')}
            style={{
              backgroundColor: option == 'Note' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Note' ? 'orange' : '#606060',
              }}>
              Note
            </Text>
          </Pressable>
        </View>

        {option == 'Budget' && (
          <View>
            <View
              style={{
                paddingTop: 15,
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <MaterialDesignIcons
                onPress={handlePrevMonth}
                name="chevron-left"
                size={23}
                color="black"
              />

              <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
                {currentDate.format('MMM YYYY')}
              </Text>

              <MaterialDesignIcons
                onPress={handleNextMonth}
                name="chevron-right"
                size={23}
                color="black"
              />
            </View>
          </View>
        )}
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: '100%'}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'black'}}
            style={{backgroundColor: 'white'}}
            labelStyle={{fontWeight: 'bold'}}
            activeColor="black"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default StatsScreen;
