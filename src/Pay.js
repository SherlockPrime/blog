import React, { useState } from 'react';
import axios from 'axios'; // 서버와 통신하기 위해 axios를 사용합니다.


const Pay = () => {
    const [amount, setAmount] = useState(''); // 사용자가 지불할 금액
    const [points, setPoints] = useState(0); // 사용자의 포인트

    const handlePayment = async () => {
        try {
            // 서버에 결제를 요청합니다. 서버는 카카오페이 API를 호출하여 결제 URL을 받아와야 합니다.
            const response = await axios.post('/api/kakaopay/payment', { amount: amount });
            const paymentUrl = response.data.next_redirect_pc_url; // 카카오페이로 리다이렉트할 URL
            
            // 카카오페이 결제 페이지로 사용자를 리다이렉트합니다.
            window.location.href = paymentUrl;
        } catch (error) {
            console.error("결제 에러:", error);
        }
    };

    const convertToPoints = (amount) => {
        // 결제 금액에 따라 포인트를 계산하는 로직입니다. 실제 비즈니스 규칙에 따라 수정이 필요할 수 있습니다.
        return amount * 1; // 예: 1원 = 1포인트
    };

    const handleSuccessPayment = (amount) => {
        // 결제가 성공한 경우 호출되는 함수입니다. 
        // 여기서는 단순화된 예시로, 실제로는 서버에서 결제 검증 후 이 함수를 호출해야 합니다.
        const newPoints = convertToPoints(amount);
        setPoints(prevPoints => prevPoints + newPoints);
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