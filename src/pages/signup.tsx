import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import React, { useState } from 'react'
import { useCallback } from 'react'
import { useContext } from 'react'
import { Container } from 'semantic-ui-react'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
}

const WizardFormContext = React.createContext(null)

export const useWizardAction = () => {
    const [steps, setStepAction] = useState([])
    const wizardForm = useContext(WizardFormContext)
    const router = useRouter()

    const methods = {
        updateAction(data: any) {
            setStepAction((state) => state.concat(data))
            const step = methods.getStep()?.split('step').pop()
            router.push('/signup', `#step${Number(step) + 1}`)
        },
        previousAction() {},
        getStep() {
            if (typeof window === undefined) return ''
            return window.location.hash.split('#').pop()
        },
        steps,
    }

    return methods
}

const SignInPage: NextPage = () => {
    const { getStep } = useWizardAction()
    return (
        <WizardFormContext.Provider value={null}>
            <Container className="text-center">
                {getStep() === 'step1' && <MobilePhoneForm />}
                {getStep() === 'step2' && <OTPForm />}
            </Container>
        </WizardFormContext.Provider>
    )
    // const { triggerSubmitHandler, confirmationResult, phoneNumber, loading } = useFirebaseFormHandlers({
    //     containerId: 'captcha-landing',
    // })
    // // const { register, errors, handleSubmit } = useForm<IMemberSignInPageForm>()

    // return (
    //     <div className="min-h-screen base-container">
    //         <CoverSpinning display={loading} />
    //         {!confirmationResult && (
    //             <div className="m-auto w-full md:w-1/2 grid grid-flow-row gap-y-4">
    //                 <h1 className="text-3xl">สถาบัน The Banana</h1>
    //                 <div>กรุณากรอกหมายเลขโทรศัพท์มือถือ เพื่อรับสิทธิ์ประโยชน์มากมายกับทางสถาบัน The Banana</div>

    //                 <form className="grid grid-flow-row gap-4" onSubmit={handleSubmit(triggerSubmitHandler)}>
    //                     <div>
    //                         <label htmlFor="phoneNumber" className="block">
    //                             เบอร์โทรศัพท์
    //                         </label>
    //                         <input
    //                             className={`border rounded-md border-solid border-${
    //                                 errors.phoneNumber ? 'red-500' : 'black'
    //                             } p-2 w-full`}
    //                             name="phoneNumber"
    //                             id="phoneNumber"
    //                             maxLength={10}
    //                             pattern="[0-9]*"
    //                             inputMode="decimal"
    //                             ref={register({
    //                                 required: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
    //                                 pattern: /^0?[8|9|6|5|4][0-9]{8}$/,
    //                             })}
    //                         />
    //                         {errors.phoneNumber && <small className="text-red-500">{errors.phoneNumber.message}</small>}
    //                     </div>
    //                     <div className={`${errors.acceptedTC ? 'text-red-500' : 'text-black'}`}>
    //                         <input
    //                             type="checkbox"
    //                             className="transform scale-150 mr-2"
    //                             name="acceptedTC"
    //                             ref={register({ required: true })}
    //                         />
    //                         <span> ยอมรับข้อกำหนดและเงื่อนไขการใช้บริการ</span>
    //                     </div>

    //                     <div id="captcha-landing" />

    //                     <button
    //                         type="submit"
    //                         id="phone-signin-button"
    //                         className="bg-yellow-500 text-black p-4 text-center rounded"
    //                     >
    //                         สมัครสมาชิก
    //                     </button>
    //                 </form>
    //             </div>
    //         )}
    //         {confirmationResult && (
    //             <OTPPinForm
    //                 lineUserProfile={{ ...lineUserInfo, email: window.liff.getDecodedIDToken()?.email }}
    //                 phoneNumber={phoneNumber}
    //                 confirmationResult={confirmationResult}
    //             />
    //         )}
    //     </div>
    // )
}

export default SignInPage
