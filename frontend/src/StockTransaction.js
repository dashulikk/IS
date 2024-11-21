import { Modal, Button, NumberInput, Center } from '@mantine/core';
import { useState } from 'react';
import {notifications} from "@mantine/notifications";

export default function StockTransaction({opened, open, close, onclickFunc, isSell, token, stockName, callBack}) {
    const [amount, setAmount] = useState("");
    return <Modal opened={opened} onClose={close} withCloseButton={false}>
              <NumberInput 
                label="Amount" 
                placeholder="Amount" 
                allowNegative={false}
                size="md"
                style={{ marginBottom: 20 }}
                onChange={setAmount}
              />
              <Center>
              <Button onClick={() => {
                onclickFunc(token, stockName, amount).then((response) => {
                    if (!response.ok) {
                        console.error("Error performing operation:", response.status);
                      notifications.show({
                          title: 'Error performing operation',
                          color: 'red'
                      })
                    }
                    callBack();
                })
              }}>
                {isSell ? "Sell" : "Buy"}
              </Button>
              </Center>
            </Modal>
}