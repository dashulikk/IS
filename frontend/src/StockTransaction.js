import { Modal, Button, NumberInput, Center } from '@mantine/core';
import { useState } from 'react';

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
                onclickFunc(token, stockName, amount).then(() => {
                    callBack();
                });
              }}>
                {isSell ? "Sell" : "Buy"}
              </Button>
              </Center>
            </Modal>
}