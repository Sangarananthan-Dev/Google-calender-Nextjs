{
    /* EVENT BODY */
}
<div className="px-4 space-y-4  flex-grow ">
    <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[100%] h-[100%]"
    >
        <div className=" h-fit flex-shrink-0 ">
            <TabsList className="flex gap-2 items-center justify-start w-full  p-0 bg-transparent border-b-2 rounded-none shadow-none">
                <TabsTrigger
                    value="event-details"
                    className="max-w-fit data-[state=active]:bg-transparent  data-[state=active]:shadow-none data-[state=active]:border-b-[#0b57d0] border-b-2  data-[state=active]:text-[#0b57d0] m-0 rounded-none shadow-none"
                >
                    Event details
                </TabsTrigger>
                <TabsTrigger
                    value="guests"
                    className="max-w-fit data-[state=active]:bg-transparent  data-[state=active]:shadow-none data-[state=active]:border-b-[#0b57d0] border-b-2  data-[state=active]:text-[#0b57d0] m-0 rounded-none shadow-none"
                >
                    Guests
                </TabsTrigger>
            </TabsList>
        </div>

        <div className=" h-[320px] overflow-y-auto custom-scrollbar ">
            <TabsContent value="event-details" className="space-y-4 pt-4">
                {/* Google Meet */}
                <Field name="meetingType">
                    {({ field }) => (
                        <div className="flex items-center space">
                            {field.value ? (
                                <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-md">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="100"
                                            height="100"
                                            viewBox="0 0 48 48"
                                        >
                                            <rect
                                                width="16"
                                                height="16"
                                                x="12"
                                                y="16"
                                                fill="#fff"
                                                transform="rotate(-90 20 24)"
                                            ></rect>
                                            <polygon
                                                fill="#1e88e5"
                                                points="3,17 3,31 8,32 13,31 13,17 8,16"
                                            ></polygon>
                                            <path
                                                fill="#4caf50"
                                                d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                                            ></path>
                                            <path
                                                fill="#fbc02d"
                                                d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                                            ></path>
                                            <path
                                                fill="#1565c0"
                                                d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                                            ></path>
                                            <polygon
                                                fill="#e53935"
                                                points="13,7 13,17 3,17"
                                            ></polygon>
                                            <polygon
                                                fill="#2e7d32"
                                                points="38,24 37,32.45 27,24 37,15.55"
                                            ></polygon>
                                            <path
                                                fill="#4caf50"
                                                d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-green-700 text-sm font-semibold">
                                        Meeting Added
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => formik.setFieldValue("meetingType", false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="flex items-center space-x-2 p-2 cursor-pointer rounded-2xl"
                                    onClick={() => formik.setFieldValue("meetingType", true)}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="100"
                                            height="100"
                                            viewBox="0 0 48 48"
                                        >
                                            <rect
                                                width="16"
                                                height="16"
                                                x="12"
                                                y="16"
                                                fill="#fff"
                                                transform="rotate(-90 20 24)"
                                            ></rect>
                                            <polygon
                                                fill="#1e88e5"
                                                points="3,17 3,31 8,32 13,31 13,17 8,16"
                                            ></polygon>
                                            <path
                                                fill="#4caf50"
                                                d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                                            ></path>
                                            <path
                                                fill="#fbc02d"
                                                d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                                            ></path>
                                            <path
                                                fill="#1565c0"
                                                d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                                            ></path>
                                            <polygon
                                                fill="#e53935"
                                                points="13,7 13,17 3,17"
                                            ></polygon>
                                            <polygon
                                                fill="#2e7d32"
                                                points="38,24 37,32.45 27,24 37,15.55"
                                            ></polygon>
                                            <path
                                                fill="#4caf50"
                                                d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-600 hover:text-blue-700 text-sm font-medium ">
                                        Add Google Meet video conferencing
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </Field>

                {/* Location */}
                <Field name="location">
                    {({ field }) => (
                        <div className="flex items-center space-x-2 px-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <Input
                                {...field}
                                placeholder="Add location"
                                className="flex-1 custom-input"
                            />
                        </div>
                    )}
                </Field>
                {/* Reminders */}
                <FieldArray name="reminders">
                    {({ push, remove }) => (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium">Reminders</span>
                            </div>
                            {formik.values.reminders.map((reminder, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Select
                                        value={reminder.method}
                                        onValueChange={(value) =>
                                            formik.setFieldValue(`reminders.${index}.method`, value)
                                        }
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reminderMethods.map((method) => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        value={reminder.minutes}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                `reminders.${index}.minutes`,
                                                Number.parseInt(e.target.value)
                                            )
                                        }
                                        className="w-[80px]"
                                        placeholder="Minutes"
                                    />
                                    <span className="text-sm">minutes before</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => remove(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-blue-600"
                                onClick={() => push({ method: "email", minutes: 30 })}
                            >
                                Add reminder
                            </Button>
                        </div>
                    )}
                </FieldArray>

                {/* Max Attendees */}
                <Field name="maxAttendees">
                    {({ field }) => (
                        <div className="flex items-center space-x-2 px-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <Input
                                {...field}
                                type="number"
                                placeholder="Maximum attendees"
                                className="w-[200px] custom-input"
                                value={field.value || ""}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "maxAttendees",
                                        e.target.value ? Number.parseInt(e.target.value) : null
                                    )
                                }
                            />
                        </div>
                    )}
                </Field>

                {/* Send Updates */}
                <Field name="sendUpdates">
                    {({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <Select
                                value={field.value}
                                onValueChange={(value) =>
                                    formik.setFieldValue("sendUpdates", value)
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Send updates" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sendUpdatesOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </Field>

                {/* Send Notifications */}
                <Field name="sendNotifications">
                    {({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="send-notifications"
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                    formik.setFieldValue("sendNotifications", !!checked)
                                }
                            />
                            <label
                                htmlFor="send-notifications"
                                className="text-sm font-medium"
                            >
                                Send notifications to attendees
                            </label>
                        </div>
                    )}
                </Field>

                {/* Attachments */}
                <FieldArray name="attachments">
                    {({ push, remove }) => (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Upload className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium">Attachments</span>
                            </div>
                            {formik.values.attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
                                >
                                    <span className="flex-1 text-sm">{attachment.title}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => remove(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    push({
                                        fileUrl: "",
                                        title: "New Attachment",
                                        mimeType: "application/pdf",
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Attachment
                            </Button>
                        </div>
                    )}
                </FieldArray>

                {/* Calendar/Color */}
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Calendar</span>
                        <Field name="colorId">
                            {({ field }) => (
                                <Popover
                                    open={showColorPicker}
                                    onOpenChange={setShowColorPicker}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-8 px-2 flex items-center space-x-2 bg-transparent"
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        calendarColors[field.value]?.background ||
                                                        "#5484ed",
                                                }}
                                            />
                                            <span>color</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-2">
                                        <div className="grid grid-cols-6 gap-1">
                                            {Object.entries(calendarColors).map(([id, color]) => (
                                                <div
                                                    key={id}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full cursor-pointer",
                                                        field.value === id &&
                                                        "ring-2 ring-offset-1 ring-black"
                                                    )}
                                                    style={{ backgroundColor: color.background }}
                                                    onClick={() => {
                                                        formik.setFieldValue("colorId", id);
                                                        setShowColorPicker(false);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </Field>
                    </div>
                </div>

                {/* Event Settings */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Field name="transparency">
                            {({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("transparency", value)
                                    }
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transparencyOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </Field>

                        <Field name="visibility">
                            {({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("visibility", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {visibilityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </Field>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Field name="status">
                            {({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("status", value)
                                    }
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </Field>

                        <Field name="eventType">
                            {({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        formik.setFieldValue("eventType", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Event Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </Field>
                    </div>
                </div>

                {/* Description */}
                <Field name="description">
                    {({ field }) => (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 border-b pb-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Bold className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Italic className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ListOrdered className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Strikethrough className="h-4 w-4" />
                                </Button>
                            </div>
                            <Textarea
                                {...field}
                                placeholder="Add description"
                                className="min-h-[100px]"
                            />
                        </div>
                    )}
                </Field>
            </TabsContent>

            <TabsContent value="guests" className="space-y-4 pt-4">
             
            </TabsContent>
        </div>
    </Tabs>
</div>;
