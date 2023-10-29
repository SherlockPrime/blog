import React, { useState } from 'react';

const Pay = () => {
    const [amount, setAmount] = useState(''); // 사용자가 지불할 금액
    const [points, setPoints] = useState(0); // 사용자의 포인트

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:3001/payment/ready', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: amount }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const paymentUrl = result.next_redirect_pc_url;
            window.location.href = paymentUrl;
        } catch (error) {
            console.error("결제 에러:", error);
        }
    };

    const convertToPoints = (amount) => {
        return amount * 1; // 예: 1원 = 1포인트
    };

    const handleSuccessPayment = (amount) => {
        const newPoints = convertToPoints(amount);
        setPoints(prevPoints => prevPoints + newPoints);
    };

    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch('http://localhost:3001/payment/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.status === "success") {
                handleSuccessPayment(amount);
            }
        } catch (error) {
            console.error("결제 확인 에러:", error);
        }
    };

    return (
        <div>
            <h1>결제 페이지</h1>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="결제할 금액을 입력하세요" 
            />
            <button onClick={handlePayment}>카카오페이로 결제</button>
            <h2>내 포인트: {points}점</h2>
        </div>
    );
};

export default Pay;