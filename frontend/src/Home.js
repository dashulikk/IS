import { Avatar, Badge, Button, Card, Text, Center, Title, Stack, RingProgress, TextInput, Table, Modal, NumberInput } from '@mantine/core';
import { buyStock, getBalance, getPortfolio, getStockPrice, sellStock, topUp } from './brokerRequests';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import StockTransaction from './StockTransaction';
import {notifications} from "@mantine/notifications";

function Home() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [balance, setBalance] = useState(null);

    const refreshBalance = () => {
      getBalance(token)
          .then(response => response.json())
          .then(data => setBalance(parseFloat(data.balance).toFixed(2)))
          .catch((error) => {
                      console.error("Error fetching balance:", error)
                      notifications.show({
                          title: 'Error fetching balance',
                          color: 'red'
                      });
          });
    }
  
    useEffect(() => {
      if (!token) {
        console.log("No token found, redirecting to login...");
        navigate("/login");
      } else {
        refreshBalance();
      }
    }, []);

    const [searchStr, setSearchStr] = useState("");
    const [searchStocks, setSearchStocks] = useState([]);
    const [portfolioStocks, setPortfolioStocks] = useState([]);

    const [sellOpened, { open: sellOpen, close: sellClose }] = useDisclosure(false);
    const [buyOpened, { open: buyOpen, close: buyClose }] = useDisclosure(false);
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
      getPortfolio(token)
        .then(response => response.json())
        .then(({portfolio}) => {
          const porfolio_array = [];
          const portfolioCleaned = portfolio.replace(/'/g, '"');
          for (const [stock_name, amount] of Object.entries(JSON.parse(portfolioCleaned))) {
            porfolio_array.push(
              <Table.Tr key={`PORTFOLIO_${stock_name}`}>
                            <Table.Td>{stock_name}</Table.Td>
                            <Table.Td>{parseFloat(amount).toFixed(2)}</Table.Td>
                            <Table.Td><Badge color="green" style={{ cursor: 'pointer' }} onClick={() => {
                              setSelectedStock(stock_name);
                              buyOpen();
                            }}>Buy</Badge></Table.Td>
                            <Table.Td><Badge color="red" style={{ cursor: 'pointer' }} onClick={() => {
                              setSelectedStock(stock_name);
                              sellOpen();
                            }}>Sell</Badge></Table.Td>
                          </Table.Tr>
            )
          }
          setPortfolioStocks(porfolio_array);
        }
        )
          .catch((error) => {
                     console.error("Error fetching portfolio:", error);
                      notifications.show({
                          title: 'Error fetching portfolio',
                          color: 'red'
                      });
          });
    }, [portfolioStocks]);


    const [topUpOpened, { open: topUpOpen, close: topUpClose }] = useDisclosure(false);
    const [topUpValue, setTopUpValue] = useState("");
  

  return (
    <div style={{height: "100vh"}}>
    <StockTransaction opened={sellOpened} close={sellClose} open={sellOpen} onclickFunc={sellStock} token={token} isSell={true} stockName={selectedStock} callBack={() => {
      refreshBalance();
      sellClose();
    }}/>
    <StockTransaction opened={buyOpened} close={buyClose} open={buyOpen} onclickFunc={buyStock} token={token} isSell={false} stockName={selectedStock} callBack={() => {
      refreshBalance();
      buyClose();
    }}/>

    <div style={{ height: "5vh", display: "flex", flexDirection: "row"}}>
      <div style={{ width: "10%", display: "flex", paddingLeft: "30px", paddingTop: "40px", flexDirection: "row", alignItems: 'center' }}>
        <Avatar radius="xl" color="indigo" />
        <Text size='xl' style={{marginLeft: "5px"}}>{localStorage.getItem("username")}</Text>
      </div>
      <div style={{width: "80%"}}/>
      <div style={{ width: "10%", display: "flex", paddingLeft: "30px", paddingTop: "40px", flexDirection: "row", alignItems: 'center' }}>
          <Button color="red" style={{marginTop: "20px"}} onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login")
          }}>
              Logout
          </Button>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", height: '95vh', justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "50%", display: "flex", flexDirection: "row", width: "80%" }}>
        <div style={{ width: "34%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
            <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "100%", height: "100%" }}>
          <Title order={1}>Cash</Title>
          <Center style={{height: "100%"}}>
          <Stack align="center" spacing="">
            
          <RingProgress
        size={240}
        sections={[{ value: 100, color: 'green' }]}
        label={
          <Text c="green" fw={700} ta="center" size="xl">
            {`${balance} $`}
          </Text>
        }
      />

            {/* Top Up Button */}

            <Modal opened={topUpOpened} onClose={topUpClose} withCloseButton={false}>
              <NumberInput 
                label="Amount" 
                placeholder="Top Up Amount" 
                allowNegative={false}
                size="md"
                style={{ marginBottom: 20 }}
                onChange={setTopUpValue}
              />
              <Center>
              <Button onClick={() => {
                  if (isNaN(parseFloat(topUpValue))) {
                      notifications.show({
                          title: 'Error updating user balance',
                          message: 'Wrong amount',
                          color: 'red'
                      });
                  } else {
                      topUp(token, parseFloat(topUpValue)).then(refreshBalance()).then(() => {
                      refreshBalance();
                      topUpClose();
                    });
                  }
              }}>
                Top Up
              </Button>
              </Center>
            </Modal>
            <Button color="yellow" size="lg" style={{marginTop: "20px"}} onClick={
              () => {
                topUpOpen();
              }
            }>
              Top Up
            </Button>
          </Stack>
          </Center>
        </Card>
        </div>
         <div style={{ width: "1%"}}></div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "100%", height: "100%" }}>
          <Title order={1}>Portfolio</Title>
          <div style={{overflow: "auto"}}>
          <Table style={{marginTop: "20px"}}>
            <Table.Thead>
                <Table.Tr>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{portfolioStocks}</Table.Tbody>
        </Table>
        </div>
        </Card>
        </div>
      </div>
      <div style={{ height: "1%" }}/>
      <div style={{ height: "35%", display: "flex", justifyContent: "center", alignItems: "center", width: "80%"}}>
        <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "100%", height: "100%" }}>
          <Title order={1}>Stocks</Title>
          <div style={{display: "flex", flexDirection: "row", marginTop: "20px"}}>
                <TextInput size='md' style={{width: "40%"}}
                    placeholder="Stock ticker"
                    onChange={(event) => {
                      setSearchStr(event.target.value);
                    }}
                />
                <Button style={{marginLeft: "10px", height: "100%"}} onClick={() => {
                  console.log(searchStr);
                  getStockPrice(searchStr)
                  .then((response) => response.json())
                  .then(({stock_price}) => {
                    if (stock_price !== undefined && stock_price != null) {
                      setSearchStocks([
                        {
                          stock: searchStr,
                          price: stock_price
                        }
                      ].map(
                        (element) => (
                          <Table.Tr key={`SEARCH_${element.stock}`}>
                            <Table.Td>{element.stock}</Table.Td>
                            <Table.Td>{parseFloat(element.price).toFixed(2)}</Table.Td>
                            <Table.Td><Badge color="green" style={{ cursor: 'pointer' }} onClick={() => {
                              setSelectedStock(element.stock);
                              buyOpen();
                            }}>Buy</Badge></Table.Td>
                            <Table.Td><Badge color="red" style={{ cursor: 'pointer' }} onClick={() => {
                              setSelectedStock(element.stock);
                              sellOpen();
                            }}>Sell</Badge></Table.Td>
                          </Table.Tr>
                        )
                      ));
                    } else {
                        throw Error("Cannot fetch stock details");
                    }
                  })
                  .catch((error) => {
                      console.error("Error fetching stock details:", error);
                      notifications.show({
                          title: 'Error fetching stock details',
                          color: 'red'
                      })
                  });
                }
                }>
                  Search
                </Button>
          </div>

          <div style={{overflow: "auto"}}>
          <Table style={{marginTop: "20px"}}>
            <Table.Thead>
                <Table.Tr>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{searchStocks}</Table.Tbody>
        </Table>
        </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

export default Home;