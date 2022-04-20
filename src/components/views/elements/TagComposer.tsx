/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { ChangeEvent, FormEvent } from "react";

import Field from "./Field";
import { IInputValidationProps } from "./IInputValidation";
import { _t } from "../../../languageHandler";
import AccessibleButton from "./AccessibleButton";
import { IFieldState, IValidationResult } from "./Validation";

interface IProps extends IInputValidationProps{
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
}

interface IState {
    newTag: string;
    isNewTagValid: boolean;
}

/**
 * A simple, controlled, composer for entering string tags. Contains a simple
 * input, add button, and per-tag remove button.
 */
export default class TagComposer extends React.PureComponent<IProps, IState> {
    public constructor(props: IProps) {
        super(props);

        this.state = {
            newTag: "",
            isNewTagValid: false,
        };
    }

    private onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({ newTag: ev.target.value });
    };

    private onAdd = (ev: FormEvent) => {
        ev.preventDefault();
        if (!this.state.newTag || !this.state.isNewTagValid) return;

        this.props.onAdd(this.state.newTag);
        this.setState({ newTag: "" });
    };

    private onRemove(tag: string) {
        // We probably don't need to proxy this, but for
        // sanity of `this` we'll do so anyways.
        this.props.onRemove(tag);
    }

    private onValidateKeyword = async (fieldState: IFieldState): Promise<IValidationResult> => {
        if (!this.props.onValidate) {
            this.setState({ isNewTagValid: true });
            return { valid: false };
        }
        const result = await this.props.onValidate(fieldState);
        this.setState({ isNewTagValid: result.valid });
        return result;
    };

    public render() {
        return <div className='mx_TagComposer'>
            <form className='mx_TagComposer_input' onSubmit={this.onAdd}>
                <Field
                    value={this.state.newTag}
                    onChange={this.onInputChange}
                    label={this.props.label || _t("Keyword")}
                    placeholder={this.props.placeholder || _t("New keyword")}
                    disabled={this.props.disabled}
                    autoComplete="off"
                    onValidate={this.onValidateKeyword}
                    validateOnBlur={this.props.validateOnBlur}
                    validateOnChange={this.props.validateOnChange}
                    validateOnFocus={this.props.validateOnFocus}
                    forceValidity={this.props.forceValidity}
                />
                <AccessibleButton onClick={this.onAdd} kind='primary' disabled={this.props.disabled || !this.state.isNewTagValid}>
                    { _t("Add") }
                </AccessibleButton>
            </form>
            <div className='mx_TagComposer_tags'>
                { this.props.tags.map((t, i) => (<div className='mx_TagComposer_tag' key={i}>
                    <span>{ t }</span>
                    <AccessibleButton onClick={this.onRemove.bind(this, t)} disabled={this.props.disabled} />
                </div>)) }
            </div>
        </div>;
    }
}
