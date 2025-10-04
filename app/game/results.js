import React from 'react';
import RoundResults from '../../screens/RoundResults';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

export default function ResultsPage() {
  return (
    <RequiredAuthWrapper 
      title="النتائج تتطلب تسجيل الدخول"
      message="لعرض نتائج اللعبة وحفظ الإحصائيات، يجب تسجيل الدخول أولاً"
    >
      <RoundResults />
    </RequiredAuthWrapper>
  );
}