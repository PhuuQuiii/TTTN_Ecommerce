import { useRouter } from 'next/router';
import RechargeWallet from "../../src/Components/PaypalButton";

export default function Checkout() {
  const router = useRouter();
  const { amount } = router.query;

  return (
    <div>
      <RechargeWallet amount={amount} />
    </div>
  );
}