import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { Grid } from '@material-ui/core'
import { NextPage } from 'next'

import React, { useState } from 'react'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
}

const SignInPage: NextPage = () => {
    const handleConfirmChange = (val: firebase.default.auth.ConfirmationResult) => {}
    return (
        <Grid style={{ minHeight: '100vh' }} container direction="row" justifyContent="center" alignItems="center">
            <MobilePhoneForm onConfirmedChange={handleConfirmChange} />
        </Grid>
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
