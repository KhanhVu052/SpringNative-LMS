import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function HomeworkRedirect() {
  const { id } = useLocalSearchParams();
  return <Redirect href={`/course/enrolled/${id}/learn` as any} />;
}
