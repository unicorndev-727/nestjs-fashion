import { useTranslations } from "next-intl";
import { PaymentType } from "../../pages/checkout";

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod, defaultValue }: { defaultValue: PaymentType, paymentMethod: PaymentType, setPaymentMethod: (value: PaymentType) => void }) => {
    const t = useTranslations("CartWishlist");

    return (
        <div key={`payment-selector-${defaultValue}`} onClick={() =>{
            setPaymentMethod(defaultValue)
        } } className="cursor-pointer">
            <label
                htmlFor={defaultValue}
                className="relative flex flex-col bg-white p-5 rounded-lg shadow-md border border-gray300 cursor-pointer"
            >
                <span className="font-semibold text-gray-500 text-base leading-tight capitalize">
                    {t(defaultValue.toLocaleLowerCase())}
                </span>
                <input
                    type="radio"
                    name="plan"
                    id={defaultValue}
                    value={paymentMethod}
                    className="absolute h-0 w-0 appearance-none"
                />
                <span
                    aria-hidden="true"
                    className={`${paymentMethod === defaultValue
                        ? "block"
                        : "hidden"
                        } absolute inset-0 border-2 border-gray500 bg-opacity-10 rounded-lg`}
                >
                    <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </span>
            </label>
        </div>)
}

export default PaymentMethodSelector;