import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import React, {useState} from 'react';
import {Parser} from 'expr-eval';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const CreateExpense = () => {
  const [option, setoption] = useState('Income');
  const [currentDate, setcurrentDate] = useState(moment());
  const currentformatedDate = currentDate.format('DD-MM-YY (ddd)');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState();
  const [showcalculator, setShowcalculator] = useState(false);
  const [showcategory, setShowcategory] = useState(false);
  const [showaccount, setShowaccount] = useState(false);
  const [input, setInput] = useState('');
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [loading, setloading] = useState(false);

  const items = [
    'Food',
    'Social Life',
    'Pets',
    'Transport',
    'Culture',
    'Household',
    'Apparel',
    'Beauty',
    'Health',
    'Education',
    'Gift',
    'Other',
    'Accessories',
    'Bills',
    'Clear'
  ];

  const newItems = [
    'Allowance',
    'Salary',
    'Petty Cash',
    'Bonus',
    'Other',
    'Add',
    'Clear',
  ];

  const setShowCalculatorstatus = () => {
    setShowcategory(false);
    setShowaccount(false);
    setShowcalculator(!showcalculator);
  };

  const setShowCategoryStatus = () => {
    setShowaccount(false);
    setShowcalculator(false);
    setShowcategory(true);
  };

  const setAccountShow = () => {
    setShowcalculator(false);
    setShowcategory(false);
    setShowaccount(true);
  };

  const selectCategory = cat => {
    if (cat === 'Clear') {
      setCategory('');
    } else {
      setCategory(cat);
    }
    setShowcategory(false);
  };

  const selectAccount = acc => {
    if (acc === 'Clear') {
      setAccount('');
    } else {
      setAccount(acc);
    }
    setShowaccount(false);
  };

  const accounts = ['Cash', 'Bank Accounts', 'Card', 'Clear'];

  const handlePress = value => {
    if (value === 'ok') {
      setShowcalculator(false);
      return;
    }
    if (value === '=') {
      try {
        const result = Parser.evaluate(input);
        setInput(result.toString());
      } catch (e) {
        console.log('error', e);
      }
    } else if (value === 'C') {
      setInput('');
    } else if (value === '<-') {
      setInput(prev => prev.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const handleCreateExpense = async () => {
    if (!input || !note || !category || !account) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields ❗',
        text2: 'Please fill all fields before saving.',
      });

      return;
    }

    setloading(true);
    try {
      const expense = {
        amount: parseFloat(input),
        type: option,
        category,
        account,
        description,
        date: currentDate.format('MMMM YYYY'),
        note,
        day: currentDate.format('DD ddd'),
      };

      const res = await axios.post(
        'http://10.0.2.2:3000/api/expense/add',
        expense,
      );

      Toast.show({
        type: 'success',
        text1: 'Saved Successfully 🎉',
        text2: res.data.message || 'Expense added.',
      });

      setoption('');
      setDescription('');
      setAccount('');
      setCategory('');
      setInput('');
      setNote('');

      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } catch (error) {
      // If error comes from response
      const errorMessage = error.res?.data?.message || 'Something went wrong.';

      Toast.show({
        type: 'error',
        text1: 'Save Failed ❌',
        text2: errorMessage,
      });
    } finally {
      setloading(false); // stop loading animation
    }
  };

  const displayedItems = option === 'Income' ? newItems : items;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 8,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              padding: 5,
              backgroundColor: 'white',
            }}>
            <Ionicons name="search-outline" size={23} color="black" />
            <Text style={{fontWeight: '500'}}>Expense</Text>
            <Ionicons name="filter-outline" size={23} color="black" />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginHorizontal: 10,
              marginVertical: 15,
              backgroundColor: 'white',
              padding: 10,
            }}>
            <Pressable
              onPress={() => setoption('Income')}
              style={{
                backgroundColor: option == 'Income' ? 'white' : '#F5F5F5',
                paddingHorizontal: 30,
                paddingVertical: 5,
                borderRadius: 6,
                borderWidth: 0.8,
                borderColor: option == 'Income' ? '#007FFF' : '#D0D0D0',
              }}>
              <Text>Income</Text>
            </Pressable>
            <Pressable
              onPress={() => setoption('Expense')}
              style={{
                backgroundColor: option == 'Expense' ? 'white' : '#F5F5F5',
                paddingHorizontal: 30,
                paddingVertical: 5,
                borderRadius: 6,
                borderWidth: 0.8,
                borderColor: option == 'Expense' ? 'orange' : '#D0D0D0',
              }}>
              <Text>Expense</Text>
            </Pressable>
            <Pressable
              onPress={() => setoption('Transfer')}
              style={{
                backgroundColor: option == 'Transfer' ? 'white' : '#F5F5F5',
                paddingHorizontal: 30,
                paddingVertical: 5,
                borderRadius: 6,
                borderWidth: 0.8,
                borderColor: option == 'Transfer' ? 'black' : '#D0D0D0',
              }}>
              <Text>Transfer</Text>
            </Pressable>
          </View>

          <View style={{marginHorizontal: 12, gap: 20, marginTop: 7}}>
            <View style={{flexDirection: 'row', gap: 12}}>
              <Text style={{width: 60, color: '#484848'}}>Date</Text>
              <Pressable style={{flex: 1}}>
                <TextInput
                  placeholderTextColor={'black'}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                    paddingTop: 1,
                  }}
                  placeholder={currentformatedDate}
                />
              </Pressable>
            </View>

            <Pressable style={{flexDirection: 'row', gap: 12}}>
              <Text style={{width: 60, color: '#484848'}}>Amount</Text>
              <Pressable style={{flex: 1}} onPress={setShowCalculatorstatus}>
                <TextInput
                  value={input}
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                    paddingTop: 1,
                  }}
                  placeholder="Enter Amount"
                  placeholderTextColor={'grey'}
                />
              </Pressable>
            </Pressable>

            <Pressable style={{flexDirection: 'row', gap: 12}}>
              <Text style={{width: 60, color: '#484848'}}>Category</Text>
              <Pressable style={{flex: 1}} onPress={setShowCategoryStatus}>
                <TextInput
                  value={category}
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                    paddingTop: 1,
                  }}
                  placeholder="Select Category"
                  placeholderTextColor={'grey'}
                />
              </Pressable>
            </Pressable>

            <Pressable style={{flexDirection: 'row', gap: 12}}>
              <Text style={{width: 60, color: '#484848'}}>Account</Text>
              <Pressable style={{flex: 1}} onPress={setAccountShow}>
                <TextInput
                  value={account}
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                    paddingTop: 1,
                  }}
                  placeholder="Select Account"
                  placeholderTextColor={'grey'}
                />
              </Pressable>
            </Pressable>

            <View style={{flexDirection: 'row', gap: 12}}>
              <Text style={{width: 60, color: '#484848'}}>Note</Text>
              <Pressable style={{flex: 1}}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholderTextColor={'grey'}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                    paddingTop: 1,
                  }}
                  placeholder="Save your note"
                />
              </Pressable>
            </View>

            <View
              style={{
                height: 10,
                backgroundColor: '#F0F0F0',
                borderRadius: 5,
              }}></View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
              <Pressable style={{flex: 1}}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Description"
                  placeholderTextColor={'black'}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8E8E8',
                    paddingBottom: 10,
                  }}
                />
              </Pressable>
            </View>

            <TouchableOpacity
              onPress={handleCreateExpense}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : 'orange',
                padding: 10,
                borderRadius: 7,
              }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showcalculator && (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                backgroundColor: 'black',
              }}>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
                Amount
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <Ionicons name="create-outline" size={23} color="white" />
                <Ionicons name="crop-outline" size={23} color="white" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              {[
                '+',
                '-',
                '*',
                '/',
                '7',
                '8',
                '9',
                '=',
                '4',
                '5',
                '6',
                'C',
                '1',
                '2',
                '3',
                '.',
                '0',
                'ok',
                '<-',
              ].map((item, index) => (
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  key={index}
                  style={{
                    width: item === '0' ? '24.5%' : '24%',
                    backgroundColor: item === '=' ? '#ff4d4d' : 'white',
                    height: 70,
                    aspectRatio: 1.5,
                    borderWidth: 0.6,
                    borderColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: -0.3,
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: item === '=' ? '#fff' : '#000',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {showcategory && (
          <View style={{height: 400}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                backgroundColor: 'black',
              }}>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
                Category
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <Ionicons name="create-outline" size={23} color="white" />
                <Ionicons name="crop-outline" size={23} color="white" />
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignContent: 'stretch',
                }}>
                {displayedItems?.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => selectCategory(item)}
                    style={{
                      width: '33.33%',
                      marginHorizontal: item === 'Clear' ? 'auto' : null,
                      backgroundColor: item === 'Clear' ? 'red' : 'white',
                      aspectRatio: 2,
                      borderWidth: 0.6,
                      borderColor: '#E0E0E0',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: -0.3,
                    }}>
                    <Text style={{color: item === 'Clear' ? 'white' : 'black'}}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {showaccount && (
          <View style={{height: 400}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                backgroundColor: 'black',
              }}>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
                Account
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <Ionicons name="create-outline" size={23} color="white" />
                <Ionicons name="crop-outline" size={23} color="white" />
              </View>
            </View>

            <View style={{height: 400}}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignContent: 'stretch',
                }}>
                {accounts?.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => selectAccount(item)}
                    style={{
                      width: '33.33%',
                      marginHorizontal: item === 'Clear' ? 'auto' : null,
                      backgroundColor: item === 'Clear' ? 'red' : 'white',
                      aspectRatio: 2,
                      borderWidth: 0.6,
                      borderColor: '#E0E0E0',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: -0.3,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: item === 'Clear' ? 'white' : 'black',
                      }}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateExpense;
