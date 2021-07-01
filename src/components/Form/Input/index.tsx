import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';

import {
  Container,
  Label,
  Error,
  FormInput
} from './styles';

interface Props extends TextInputProps {
  control: Control;
  name: string;
  title: string;
  error?: FieldError;
}

export function Input({
  name,
  control,
  title,
  error = undefined,
  ...rest
}: Props) {
  return (
    <Container>
      <Label>{title}</Label>
      {error && <Error>{error.message}</Error>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            {...rest}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </Container>
  )
}